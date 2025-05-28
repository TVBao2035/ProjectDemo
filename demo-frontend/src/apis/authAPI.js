import axios from "../configs/axios";
import { CookiesHelper } from "../Helpers";



export const signin = async (email, password) => {
    return await axios.post("/user/SignIn", { email, password });
}

export const refreshToken = async () => {
    return await axios.post("/user/refresh", {
        token: CookiesHelper.getRefreshToken()
    });
}
