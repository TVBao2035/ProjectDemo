import axios from "axios";
import store from "../stores/store";
import { setUser } from "../stores/userSlice";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(function (config) {
    const state = store.getState();
    const accessToken = state.user?.accessToken;
    
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    console.log("Config response", response);
    
    // store.dispatch(setUser({
    //     data: {
    //         name: "hadalf"
    //     },
    //     accessToken: "kdals;f"
    // }));
    return response.data;
}, async function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, async function (error) {
   

});
export default instance;