import { Link } from "react-router-dom";
import { ItemLink } from "../../components";
import { ROUTE_PAGES } from "../../Consts";


const Home = () => {


    return ( 
        <div className="home">
            <h1>Home</h1>
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
            <Link to="/signIn" className="sign-in-link" > 
                Sign In
            </Link>
        </div>
      );
}
 
export default Home; 