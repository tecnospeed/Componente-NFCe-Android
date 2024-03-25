import axios from 'axios';
axios.defaults.timeout = 1000 * 60

const api = axios.create({
    baseURL: 'https://pix.tecnospeed.com.br',
});

export default api;
