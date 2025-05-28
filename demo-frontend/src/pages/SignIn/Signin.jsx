import { useDispatch } from "react-redux";
import { Input } from "../../components";
import {  useState } from "react";
import { signin } from "../../apis/authAPI";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../stores/authSlice";
import { CookiesHelper } from "../../Helpers";
const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [infor, setInfor] = useState({
        email: "acb@gmail.com",
        password: "12345"
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfor(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async () => {
      try {
        const res = await signin(infor.email, infor.password);

        if(res.statusCode !== 200) {
          setError(res.message);
          return;
        }
        CookiesHelper.setRefreshToken(res.data.refreshToken); // Set refresh token in cookies
        dispatch(setAuth({
          data: {
            name: res.data.name,
            accessToken: res.data.accessToken
          }
        }));
        navigate("/");
        return;
      } catch (error) {
          setError("Error during sign in:", error.message);
          console.error("Error during sign in:", error);
      }
    }
    return ( 
        <div className="SignIn absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className="flex flex-col  items-center  w-1/3 p-9 shadow-2xl rounded-2x">
              <div className="flex justify-center">
                  <h1 className="text-4xl font-bold text-blue-700">Sign In</h1>
              </div>

              <div className="w-full">
                  <Input
                      lable="Email"
                      type="email"
                      name="email"
                      value={infor.email}
                      onChange={handleChange}
                  />
                  <Input
                      lable="Password"
                      type="password"
                      name="password"
                      value={infor.password}
                      onChange={handleChange}
                    />
                    <div className="flex flex-col gap-2 ">
                      <button 
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                          Submit
                      </button>
                      <span className="text-red-500 text-center">{error}</span>
                    </div>
              </div>
            </div>
        </div>
     );
}
 
export default SignIn;