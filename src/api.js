import axios from 'axios';

// Create an axios instance with the backend base URL
const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

// API call for Login
export const loginUser = (credentials) => API.post('/login', credentials);

// API call for Registration (Sign In)
export const registerUser = (userData) => API.post('/register', userData);

// API call to save performance (Admin)
export const savePerformance = (data) => API.post('/performance', data);

// API call to get performance (Student)
export const getStudentReport = (id) => API.get(`/student-report/${id}`);

export default API;