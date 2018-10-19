class AddLabelIdToLabel < ActiveRecord::Migration[5.2]
  def change
    add_column :labels, :label_id, :integer
  end
end
