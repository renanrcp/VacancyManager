class CreateVacancies < ActiveRecord::Migration[6.1]
  def change
    create_table :vacancies do |t|
      t.string :name
      t.string :role
      t.datetime :hiring_date

      t.timestamps
    end
  end
end
