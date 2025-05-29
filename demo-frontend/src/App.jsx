import './App.css';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Home, OrderManagement, ProductManagement, SignIn, UserManagement } from './pages';
import { Layout } from './components';
import { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from './apis/authAPI';
import { setAuth } from './stores/authSlice';
import { CookiesHelper } from './Helpers';

function App() {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const whiteList = ["/signin"];

  const handleRefreshToken = async() => {
    try {
        let res = await refreshToken();
        if(res?.statusCode === 200) {
          CookiesHelper.setRefreshToken(res?.data.refreshToken); // Set refresh token in cookies
          dispatch( setAuth({
            data: {
              name: res?.data.name,
              accessToken: res?.data.accessToken
            }
          }));
          return;
        } 
    } catch (error) {
      alert("Session expired, please sign in again." + error.message);
    }
  }
  useEffect(() => {
    if(auth.data === null && !whiteList.includes(location.pathname)) {
      handleRefreshToken();
    }
  },[]);
  
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path='/' element={<Home/>} />
        <Route path='/userManagement' element={<UserManagement/>} />
        <Route path='/productManagement' element={<ProductManagement/>} />
        <Route path='/orderManagement' element={<OrderManagement/>} />
      </Route>
      <Route path="/signin" element={<SignIn/>} />
    </Routes>
  );
}

export default App;
