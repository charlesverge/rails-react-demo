class CreateClassifieds < ActiveRecord::Migration[5.2]
  def change
    create_table :classifieds do |t|
      t.text :body

      t.timestamps
    end
  end
end
