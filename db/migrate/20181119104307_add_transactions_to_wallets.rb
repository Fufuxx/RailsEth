class AddTransactionsToWallets < ActiveRecord::Migration[5.0]
  def change
    create_table :transactions do |t|
      t.string :from
      t.string :to
      t.decimal :value
      t.decimal :confirmations
      t.boolean :credit
      t.references :wallet, index: true, foreign_key: {to_table: :wallets, on_delete: :cascade}
      t.timestamps
    end
  end
end
