class MyChannel < ApplicationCable::Channel
  require 'httparty'

  def subscribed
    p "Setting Stream"
    stream_from "MyStream"
  end

  def createWallet(data)
    p " === Creating Wallet === "
    key = Eth::Key.new
    wallet = Wallet.create(:name => data['name'], :pubkey => key.public_hex, :prvkey => key.private_hex, :address => key.address)

    ActionCable.server.broadcast "MyStream",
      { :method => 'createWallet', :status => 'success',
        :data => Wallet.all }
  end

  def getWallets
    p "=== Getting Wallets ==="
    begin
      collection = []
      Wallet.all.each do |w|
        c = {
          :wallet => w,
          :transactions => self.getTransactions(w.address),
          :balance => self.getBalance(w.address)
          #add balance 
        }

        collection << c
      end

      ActionCable.server.broadcast "MyStream",
        { :method => 'getWallets', :status => 'success',
          :data => collection }

    rescue Exception => e
      p e
    end
  end

  def getBalance(address)
    begin
      p "=== Getting Eth Wallet Balance for address #{address} ==="
      url = "https://api-ropsten.etherscan.io/api?module=account&action=balance&address=#{address}&tag=latest&apikey=#{ENV['ETH_SCAN_API_KEY']}"
      res = HTTParty.get(url)
      
      return res.parsed_response['result']
    rescue Exception => e
      p e
    end
  end

  def getTransactions(address)
    begin
      p "=== Getting address based transaction list ==="
      url = "http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=#{address}&startblock=0&endblock=99999999&sort=asc&apikey=#{ENV['ETH_SCAN_API_KEY']}"
      res = HTTParty.get(url)
      result = res.parsed_response['result']
      txs = []

      p "=== Tx Fields ==="
      result.each do |r|
        from = r['from']
        to = r['to']
        value = r['value']
        confirmations = r['confirmations']
        credit = "#{address}".downcase === r['to'] ? true : false

        tx = {
          :from => from,
          :to => to,
          :value => value,
          :confirmations => confirmations,
          :credit => credit
        }

        txs << tx
      end 

      return txs.reverse

    rescue Exception => e
      p e
      return []
    end
  end

  def generateTransaction(data)
    p "=== Generating new transaction ==="
    p data
    begin
      p "=== Wallet Name -> #{data['from']}"
      p Wallet.where(:name => data['from'])
      key = Eth::Key.new priv: Wallet.where(:name => data['from']).first.prvkey

      format_address = Eth::Utils.format_address "#{data['to_address']}"

      #Get Tx Number to set Nonce
      txCountUrl = "https://api-ropsten.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=#{key.address}&tag=latest&apikey=#{ENV['ETH_SCAN_API_KEY']}"
      
      res = HTTParty.get(txCountUrl)
      result = res.parsed_response['result']
      txNonce = Integer(result)

      p "Value Wei ?"
      p BigDecimal.new(1000000000000000000 * data['value'], 16).to_s.to_i

      tx = Eth::Tx.new({
        data: "".each_byte.map { |b| b.to_s(16) }.join,
        gas_limit: data['gas_limit'],
        gas_price: data['gas_price'],
        nonce: txNonce,
        to: format_address,
        value: BigDecimal.new(1000000000000000000 * data['value'], 16).to_s.to_i
      })

      p tx

      p "=== Tx Signing ==="
      tx.sign key

      p "=== Broadcasting ==="
      self.broadcastTransaction(tx.hex)

    rescue Exception => e
      p e
    end
  end

  def broadcastTransaction(tx)
    begin
      p "=== Broadcasting Tx to Ropsten ==="
      url = "https://api-ropsten.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=#{tx}&apikey=#{ENV['ETH_SCAN_API_KEY']}"
      res = HTTParty.get(url)
      p res
      result = res.parsed_response['result']
      p result

      ActionCable.server.broadcast "MyStream",
        { :method => 'broadcast', :status => 'success', :data => result }

      p "=== Poll transaction status ==="

    rescue Exception => e
      p e
    end
  end


end
