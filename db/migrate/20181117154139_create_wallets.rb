class CreateWallets < ActiveRecord::Migration[5.0]
  def change
    create_table :wallets do |t|
      t.string :pubkey
      t.string :prvkey

      t.timestamps
    end
  end
end
