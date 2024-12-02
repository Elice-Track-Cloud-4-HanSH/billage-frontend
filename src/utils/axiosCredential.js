import axios from 'axios';

const axiosCredential = axios.create({
  baseURL: `${import.meta.env.VITE_AXIOS_BASE_URL}`,
  withCredentials: true,
});

export default axiosCredential;
