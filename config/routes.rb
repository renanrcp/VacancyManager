Rails.application.routes.draw do
  resources :periods, only: %i[show create update]
  resources :vacancies, only: %i[index show create update]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
