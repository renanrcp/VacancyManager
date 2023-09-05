class PeriodsController < ApplicationController
  protect_from_forgery with: :null_session

  def show
    @vacancy_period = VacancyPeriod.find(params[:id])
    render json: @vacancy_period
  end

  def create
    @vacancy_period = VacancyPeriod.new(vacancy_period_params)

    if @vacancy_period.save
      render json: @vacancy_period
    else
      render status: 422
    end
  end

  def update
    @vacancy_period = VacancyPeriod.find(params[:id])

    if @vacancy_period.update(vacancy_period_params)
      render json: @vacancy_period
    else
      render status: 422
    end
  end

  private

  def vacancy_period_params
    params.permit(:start_date, :end_date, :vacancy_id)
  end
end
