class AddModelToClassified < ActiveRecord::Migration[5.2]
  def change
    add_column :classifieds, :model, :string
  end
end
