import axios from "../configs/axios";



export const signin = async (email, password) => {
    return await axios.post("/user/SignIn", { email, password });
}


