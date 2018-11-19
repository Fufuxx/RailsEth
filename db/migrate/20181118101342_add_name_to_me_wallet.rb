class AddNameToMeWallet < ActiveRecord::Migration[5.0]
  def change
    add_column :wallets, :name, :string
  end
end
