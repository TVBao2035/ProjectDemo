import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebound";
import { FaRegEdit, FaUserPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { HiArrowLeftCircle, HiArrowRightCircle } from "react-icons/hi2";
import { getOrders } from "../../apis/orderAPI";
import { setOrders } from "../../stores/orderSlice";
const OrderManagement = () => {
     const initialSearch = {
        currPage: 1,
        pageSize: 9,
        filters:[],
        sort:{
            fieldName: "name",
            isASC: true
        }
    }
    const initPaging = {
        totalPage: 1
    }


    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const orders = useSelector((state) => state.orders);

    const [searchValue, setSearchValue] = useState("");
    const [search, setSearch] = useState(initialSearch);
    const [paging, setPaging] = useState(initPaging);

    const deboundSearch = useDebounce(searchValue, 900);
    

    const handleGetOrders = async () => {
        try {
            let res = await getOrders ();
            if(res.statusCode === 200){
                dispatch(setOrders(res.data));
                return;
            }
        } catch (error) {
            
        }
    }

    
    const handlePrevious = () => {}

    const handleNext = () => {}



    useEffect(() => {
         if(auth.data){
             handleGetOrders();
         }
    }, [auth] );
    return (
        <div className="OrderManagement flex flex-col justify-between px-40 relative">
                    <div className="flex justify-between mt-3">
                        <div className="flex items-center w-1/2 ">
                            <input type="text" 
                                className="border w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="enter here " />
                        </div>
                        <FaUserPlus className="text-5xl rounded-full px-3 py-3 hover:bg-blue-400  bg-blue-500 text-white"/>
                    </div>
                    <table className="table-fixed border border-gray-200 shadow-2xl mt-10">
                        <thead className="bg-gradient-to-r from-blue-400 to-blue-700 w-3/4 mt-10 text-white select-none">
                            <tr className="">
                                <th className="px-6 py-3"  scope="col">
                                    <p>User Name</p>
                                </th>
                                <th className="px-6 py-3"  scope="col">
                                    <div className="flex gap-2 items-center">
                                        <p>Email</p>
                                        {/* <TiArrowUnsorted onClick={handlSortByName} className=" active:text-blue-100 hover:ring-1 hover:ring-white rounded-full"/> */}
                                    </div> 
                                </th>
                                <th className="px-6 py-3"  scope="col">
                                    <div className="flex gap-2 items-center">
                                        <p>Product Name</p>
                                        {/* <TiArrowUnsorted onClick={handleSortByEmail} className=" active:text-blue-100 hover:ring-1 hover:ring-white rounded-full"/> */}
                                    </div>
                                </th>
                                <th className="px-6 py-3"  scope="col">
                                    <div className="flex gap-2 items-center">
                                        <p>Price</p>
                                        {/* <TiArrowUnsorted onClick={handleSortByEmail} className=" active:text-blue-100 hover:ring-1 hover:ring-white rounded-full"/> */}
                                    </div>
                                </th>
                                
                                <th className="px-6 py-3"  scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {
                                orders?.data?.length !== 0 ? 
                                orders?.data?.map((product, index) => {
                                    return (
                                    <tr className="hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white  border border-gray-200 hover:ring-1 hover:ring-blue-500" >
                                        <td class="px-6 py-4">{product.user.name}</td>
                                        <td class="px-6 py-4">{product.user.email}</td>
                                         <td class="px-6 py-4">{product.product.name}</td>
                                        <td class="px-6 py-4">{product.product.price}</td>
                                        <td className="flex gap-5 px-6 py-4 items-center">
                                            <FaRegEdit className="text-xl text-yellow-600 hover:text-yellow-300" />
                                            <MdDeleteOutline className="text-2xl text-red-700 hover:text-red-400"/>
                                        </td>
                                    </tr>
                                    );
                                }):
                                (
                                   <tr className="hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white  border border-gray-200 hover:ring-1 hover:ring-blue-500" >
                                        <td className="px-6 py-4 text-center" colSpan={4}>No  found</td>
                                    </tr>
                                )
                            }
                            
        
                        </tbody>
                    </table>
        
                    <div className="fixed bottom-40 w-full start-0 ">
                        <div className="flex gap-3 items-center justify-center mt-5">
                            <HiArrowLeftCircle
                                className={`text-3xl ${search.currPage === 1 ? "text-gray-500" : "text-blue-500 active:text-blue-400 hover:ring-2 hover:rounded-full hover:ring-blue-500 "} `}
                                onClick={handlePrevious}
                            />
                            <div className="text-xl select-none text-blue-500 font-bold" >{search.currPage}</div>
                            <HiArrowRightCircle
                                className={`text-3xl   ${paging.totalPage === search.currPage ? "text-gray-500" : "text-blue-500 active:text-blue-400 hover:ring-2 hover:rounded-full hover:ring-blue-500"}`} 
                                onClick={handleNext}/>
        
                        </div>
                    </div>
                </div>
     );
}

 
export default OrderManagement;