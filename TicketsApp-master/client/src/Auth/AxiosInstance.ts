import axios from "axios";
import {api_url} from "../environment";
import {userService} from "../Services/UserService";

const axiosInstance = axios.create({
    baseURL: `${api_url}/api`,
    headers: {
        "content-type": "application/json"
    },
    responseType: "json"
});

axiosInstance.interceptors.request.use(
    config => {
        const token = userService.getCredentials()?.token;
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });

export default axiosInstance;
