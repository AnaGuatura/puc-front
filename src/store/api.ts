import axios from 'axios';

const api = axios.create({
  baseURL: 'http://smads-api.herokuapp.com',
});

export default api;
