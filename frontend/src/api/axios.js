import axios from 'axios';


const baseURL = import.meta.env.VITE_API_URL;
console.log(baseURL);
const api = axios.create({
  baseURL,
  withCredentials: true, // This is important for handling cookies/sessions
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
