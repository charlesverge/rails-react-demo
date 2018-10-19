class CreateWords < ActiveRecord::Migration[5.2]
  def change
    create_table :words do |t|
      t.integer :word_id
      t.string :model
      t.string :word

      t.timestamps
    end
  end
end