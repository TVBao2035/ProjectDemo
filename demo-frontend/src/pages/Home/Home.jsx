import { Link } from "react-router-dom";
import { ItemLink } from "../../components";
import { ROUTE_PAGES } from "../../Consts";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../stores/authSlice";
import Cookies from "js-cookie";
import { getUsers } from "../../apis/userAPI";
import { useEffect } from "react";
import { CookiesHelper } from "../../Helpers";

const Home = () => {
  const dispatch = useDispatch();

    return ( 
        <div className="home mt-36 pt-36">
            <div className="flex gap-4 justify-center">
              {
                ROUTE_PAGES.map((page, index) => (
                  <ItemLink 
                    to={page.to} 
                    style={page.style}
                    label={page.label} 
                    key={index}/>
                ))
              }
            </div>
        </div>
      );
}
 
export default Home; 