import { Link, Links } from "react-router-dom";
import { ROUTE_PAGES } from "../../Consts";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { CookiesHelper } from "../../Helpers";

const Header = () => {
    const auth = useSelector((state) => state.auth);
    const [display, setDisplay] = useState(false);

    const handleMouseHover = (e) => {
       setDisplay(!display)
    }
    const handleLogout = () =>{
        CookiesHelper.removeRefreshToken();
    }
    return ( 
        <div className="header bg-blue-600 text-white px-20 py-6 flex justify-between">
            <div>
                <Link to={"/"} className="text-2xl font-bold">
                    Admin Page
                </Link>
            </div>
            <div className="flex gap-4 font-bold items-center ">
                <div className="flex gap-4 font-bold items-center me-2">
                    {
                        ROUTE_PAGES.map((page, index) => (
                        <Link key={index} to={page.to}>{page.label}</Link>
                        ))
                    }
                </div>
                <div className="relative" onClick={handleMouseHover} onMouseLeave={handleMouseHover}>
                    <div className="flex gap-3 items-center" >
                        <FaUserCircle className="w-6 h-6"/>
                        <p>{auth?.data?.name}</p>
                    </div>
                    {
                        display &&
                        <div className="absolute left-0 right-0  w-full ">
                            <Link to={"/signin"} className="flex px-2 py-1 w-full bg-white text-black hover:bg-blue-400 hover:text-white" onClick={handleLogout}>Logout</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
     );
}
 
export default Header;