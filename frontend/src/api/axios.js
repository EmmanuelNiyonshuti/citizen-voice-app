import axios from 'axios';

let baseURL
if (APP_ENV === 'Development'){
  baseURL = 'http://localhost:3000/api'
}else{
  baseURL = import.meta.env.VITE_API_URL
}
const api = axios.create({
  baseURL,
  withCredentials: true, // This is important for handling cookies/sessions
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api; 