import { Link, Links } from "react-router-dom";
import { ROUTE_PAGES } from "../../Consts";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
    const user = useSelector((state) => state.user.data);
    console.log(user);
    return ( 
        <div className="header bg-blue-600 text-white px-20 py-6 flex justify-between" >
            <div>
                <Link to={"/"} className="text-2xl font-bold">
                    Management Page
                </Link>
            </div>
            <div className="flex gap-4 font-bold items-center">
                {
                    ROUTE_PAGES.map((page, index) => (
                       <Link key={index} to={page.to}>{page.label}</Link>
                    ))
                }
                <div className="flex gap-3 items-center ms-6">
                    <FaUserCircle className="w-6 h-6"/>
                    <p>{user.name}</p>
                </div>
            </div>
        </div>
     );
}
 
export default Header;