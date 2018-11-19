class AddAddressToMeWallet < ActiveRecord::Migration[5.0]
  def change
    add_column :wallets, :address, :string
  end
end
