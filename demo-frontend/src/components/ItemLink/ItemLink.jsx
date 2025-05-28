import { Link } from "react-router-dom";

const ItemLink = ({to, label, style}) => {
    return ( 
        <Link  to={to} className={`ItemLink  ${style} transition-all  ease-out duration-500 hover:shadow-2xl hover:shadow-neutral-500  hover:-translate-y-1  text-white text-2xl font-bold px-20 py-16 rounded-xl shadow-2xl`}  >
                <div>
                  <p>{label}</p>
                </div>
        </Link>
     );
}
 
export default ItemLink;