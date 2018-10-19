class AddModelToLabel < ActiveRecord::Migration[5.2]
  def change
    add_column :labels, :model, :string
  end
end
