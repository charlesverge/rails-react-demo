class Classified < ApplicationRecord
  has_and_belongs_to_many :labels
end
