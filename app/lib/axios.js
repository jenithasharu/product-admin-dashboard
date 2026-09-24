import axios from "axios";

const api = axios.create({
    baseURL: "https://dummyjson.com"
})

api.interceptors.request.use((config)=>{
    const token =typeof window !== undefined ? localStorage.getItem("token"): null;
    if (token) {
        config.headers.Authorization= `Bearer ${token}`;
    }
    return config;
})
api.interceptors.response.use(
    (response)=> response,
    (error)=>{
        console.error("API error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
)
export default api;