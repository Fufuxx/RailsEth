class Wallet < ApplicationRecord
    has_many :transactions, dependent: :destroy
end
