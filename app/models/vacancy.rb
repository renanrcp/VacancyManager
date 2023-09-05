class Vacancy < ApplicationRecord
  has_many :vacancy_periods, dependent: :destroy
end
