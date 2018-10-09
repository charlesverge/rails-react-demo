class CreateJoinTableclassifiedlabels < ActiveRecord::Migration[5.2]
  def change
    create_join_table :classifieds, :labels do |t|
      # t.index [:classified_id, :label_id]
      # t.index [:label_id, :classified_id]
    end
  end
end
