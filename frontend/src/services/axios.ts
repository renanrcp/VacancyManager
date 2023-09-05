import axios from "axios";

const getAPIClient = () => {
  const api = axios.create();

  api.interceptors.request.use(config => {
    config.baseURL = 'http://api.localhost/'
    return config;
  });

  return api;
};

export default getAPIClient;