import axios from "axios";
import store from "../stores/store";
import { refreshToken } from "../apis/authAPI";
import { setAuth } from "../stores/authSlice";
import { CookiesHelper } from "../Helpers";


const instance = axios.create({
    baseURL: process.env.REACT_APP_API
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(function (config) {

    const state = store.getState();
    
    const accessToken = state.auth?.data?.accessToken;
   
    
    if (accessToken && config.url !== "/user/refresh") {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(async(response) => {

    return response.data;
}, async function (error) {
    if(error.status === 401){
        console.log("Expried token");
       let res = await refreshToken();
       if(res?.statusCode === 401) {
            CookiesHelper.removeRefreshToken(); // Remove refresh token from cookies
            window.location.href = "/signin";
            return;
        }
        store.dispatch(setAuth({
            data: {
                name: res.data.name,
                accessToken: res.data.accessToken
            }
        }));
        CookiesHelper.setRefreshToken(res.data.refreshToken); // Set refresh token in cookies
    }

    return Promise.reject(error);
});


export default instance;