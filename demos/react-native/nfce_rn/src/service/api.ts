import axios from 'axios';
axios.defaults.timeout = 1000 * 60
const ipLocal = '192.168.1.19'

const api = axios.create({
    // baseURL: 'https://api.plugmobile.com.br/v2',
    baseURL: `http://${ipLocal}:3000/v1/`,
});

export default api;
