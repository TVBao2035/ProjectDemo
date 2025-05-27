import { Link } from "react-router-dom";

const ItemLink = ({to, label, style}) => {
    return ( 
        <Link  to={to} className={`ItemLink text-white text-2xl font-bold px-20 py-16 rounded-xl shadow-2xl ${style}`}  >
                <div>
                  <p>{label}</p>
                </div>
        </Link>
     );
}
 
export default ItemLink;