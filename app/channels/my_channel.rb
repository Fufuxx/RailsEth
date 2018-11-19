class MyChannel < ApplicationCable::Channel
  require 'httparty'

  def subscribed
    p "Setting Stream"
    stream_from "MyStream"
  end

  def createWallet(data)
    p " === Creating Wallet === "
    p data['name']
    #Generate new key pair
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
          :transactions => self.getTransactions(w.address)
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
      p "Getting Eth Wallet Balance for address #{address}"

      url = "https://api-ropsten.etherscan.io/api?module=account&action=balance&address=#{address}&tag=latest&apikey=#{ENV['ETH_SCAN_API_KEY']}"
      res = HTTParty.get(url)
      p res.parsed_response['result']
    rescue Exception => e
      p e
    end
  end

  def getTransactions(address)
    begin
      p "=== Getting address based transaction list ==="

      url = "http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=#{address}&startblock=0&endblock=99999999&sort=asc&apikey=ENV['ETH_SCAN_API_KEY']"
      
      res = HTTParty.get(url)
      result = res.parsed_response['result']

      txs = []

      " == Tx Fields == "
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
      p txs
    rescue Exception => e
      p e
    end
  end
end
