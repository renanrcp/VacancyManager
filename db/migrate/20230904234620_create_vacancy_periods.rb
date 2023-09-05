class CreateVacancyPeriods < ActiveRecord::Migration[6.1]
  def change
    create_table :vacancy_periods do |t|
      t.datetime :start_date
      t.datetime :end_date
      t.references :vacancy, null: false, foreign_key: true

      t.timestamps
    end
  end
end
