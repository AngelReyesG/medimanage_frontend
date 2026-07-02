import axios from "axios"

//Configuración base de Axios
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    header: {
        "Content-Type" : "application/json"
    }
})

API.interceptors.request.use(
    (config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, 
(error) => {
    return Promise.reject(error)
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default API