import axios from 'axios';

axios.defaults.baseURL = `${import.meta.env.VITE_AXIOS_BASE_URL}`;
axios.defaults.withCredentials = true;

export const axiosCredential = axios.create({
  baseURL: `${import.meta.env.VITE_AXIOS_BASE_URL}`,
  withCredentials: true,
});
