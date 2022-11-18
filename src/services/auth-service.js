import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const AUTH_API = `${BASE_URL}/auth`;

const api = axios.create({
    withCredentials: true
});

export const signup = (user) =>
    api.post(`${AUTH_API}/signup`, user)
        .then(response => response.data);