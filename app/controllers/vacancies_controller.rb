class VacanciesController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @vacancies = Vacancy.all
    render json: @vacancies, include: ['vacancy_periods']
  end

  def show
    @vacancy = Vacancy.find(params[:id])
    render json: @vacancy, include: ['vacancy_periods']
  end

  def create
    @vacancy = Vacancy.new(vacancy_params)

    if @vacancy.save
      render json: @vacancy, include: ['vacancy_periods']
    else
      render status: 422
    end
  end

  def update
    @vacancy = Vacancy.find(params[:id])

    if @vacancy.update(vacancy_params)
      render json: @vacancy, include: ['vacancy_periods']
    else
      render status: 422
    end
  end

  private

  def vacancy_params
    params.require(:vacancy).permit(:name, :role, :hiring_date)
  end
end
