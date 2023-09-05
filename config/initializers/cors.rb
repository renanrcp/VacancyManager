Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:80'
    resource '*', headers: :any, methods: %i[get post put]
  end

  allow do
    origins 'http://api.localhost:80'
    resource '*', headers: :any, methods: %i[get post put]
  end
end