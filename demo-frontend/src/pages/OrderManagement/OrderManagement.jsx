import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebound";
import { FaRegEdit, FaUserPlus } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineAddCircle } from "react-icons/md";
import { HiArrowLeftCircle, HiArrowRightCircle } from "react-icons/hi2";
import { getOrders, searchOrders } from "../../apis/orderAPI";
import { openOrderModal, setOrders } from "../../stores/orderSlice";
import { getProducts } from "../../apis/productAPI";
import { ModalType } from "../../Consts";
import ModalOrder from "../../components/Modals/ModalOrder";
const OrderManagement = () => {
     const initialSearch = {
        pageIndex: 1,
        pageSize: 9,
        filters:[]
    }
    const initPaging = {
        totalPage: 1
    }


    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const orders = useSelector((state) => state.orders);
    const [products, setProducts] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [search, setSearch] = useState(initialSearch);
    const [paging, setPaging] = useState(initPaging);

    const deboundSearch = useDebounce(searchValue, 900);
    
    const handleGetProducts = async () => {
        try {

            let res = await getProducts();
            if(res.statusCode === 200){
                setProducts(res.data);
                return;
            }
        } catch (error) {
            
        }
    }

    const handleGetOrders = async () => {
        try {
            let res = await searchOrders(search);
            if(res.statusCode === 200){
                dispatch(setOrders(res.data.searchData));
                setPaging({
                    totalPage: res.data.totalPages
                });
                return;
            }
        } catch (error) {
            
        }
    }

    const handleSelect = (e) => {
        setSearch(prev => ({
            ...prev,
            filters: [
                {
                    fieldName: "username",
                    value: prev.filters[0]?.value || ""
                },
                {
                    fieldName: "productid",
                    value: e.target.value
                }
            ]
        }))
        
    }
    const handlePrevious = () => {
        if(search.pageIndex > 1){
            setSearch(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
        }
    }

    const handleNext = () => {
        if(search.pageIndex < paging.totalPage) {
            setSearch(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
        }
    }

    useEffect(() => {
       setSearch(prev => ({
            ...prev,
            filters: [
                {
                    fieldName: "username",
                    value: deboundSearch
                },
                {
                    fieldName: "productid",
                    value: prev.filters[1]?.value || ""
                }
            ]
       }))
    },[deboundSearch])

    useEffect(() => {
         if(auth.data){
             handleGetOrders();
         }  
    }, [auth, search, orders.modal.count] );

    useEffect(()=>{
        if(auth.data){
             handleGetProducts();
         }
    }, [auth])
    return (
        <div className="OrderManagement flex flex-col justify-between px-40 relative">
            <ModalOrder/>
            <div className="flex justify-between mt-3">
                <div className="flex flex-col gap-2 items-center w-1/2 ">
                    <input type="text" 
                        className="border w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="enter user name " />
                    <select name="" 
                        onChange={(e) => handleSelect(e)}
                        className="border w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="">
                        <option key={0} value={""}>None</option>
                        {
                            products?.map((product, index) => {
                                return (
                                    <option key={index} value={product.id}>{product.name}</option>
                                );
                            })
                        }
                    </select>
                    
                </div>
                <MdOutlineAddCircle className="text-4xl  hover:text-blue-400  text-blue-500"
                    onClick={() => dispatch(openOrderModal({order: null, type: ModalType.CREATE}))}
                />
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
                               
                            </div> 
                        </th>
                        <th className="px-6 py-3"  scope="col">
                            <div className="flex gap-2 items-center">
                                <p>Product Name</p>
                             
                            </div>
                        </th>
                        <th className="px-6 py-3"  scope="col">
                            <div className="flex gap-2 items-center">
                                <p>Price</p>
                            </div>
                        </th>
                        
                        <th className="px-6 py-3"  scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {
                        orders?.data?.length !== 0 ? 
                        orders?.data?.map((order, index) => {
                            return (
                            <tr key={index} className="hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white  border border-gray-200 hover:ring-1 hover:ring-blue-500" >
                                <td className="px-6 py-4">{order.user.name}</td>
                                <td className="px-6 py-4">{order.user.email}</td>
                                 <td className="px-6 py-4">{order.product.name}</td>
                                <td className="px-6 py-4">{order.product.price}</td>
                                <td className="flex gap-5 px-6 py-4 items-center">
                                    <FaRegEdit className="text-xl text-yellow-600 hover:text-yellow-300" 
                                        onClick={() => dispatch(openOrderModal({
                                            order, type: ModalType.EDIT
                                        }))}
                                    />
                                    <MdDeleteOutline className="text-2xl text-red-700 hover:text-red-400"
                                        onClick={() => dispatch(openOrderModal({
                                            order,
                                            type: ModalType.DELETE
                                        }))}
                                    />
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

            <div className="fixed bottom-20 w-full start-0 ">
                <div className="flex gap-3 items-center justify-center mt-5">
                    <HiArrowLeftCircle
                        className={`text-3xl ${search.pageIndex === 1 ? "text-gray-500" : "text-blue-500 active:text-blue-400 hover:ring-2 hover:rounded-full hover:ring-blue-500 "} `}
                        onClick={handlePrevious}
                    />
                    <div className="text-xl select-none text-blue-500 font-bold" >{search.pageIndex}</div>
                    <HiArrowRightCircle
                        className={`text-3xl   ${paging.totalPage === search.pageIndex ? "text-gray-500" : "text-blue-500 active:text-blue-400 hover:ring-2 hover:rounded-full hover:ring-blue-500"}`} 
                        onClick={handleNext}/>

                </div>
            </div>
    </div>
     );
}

 
export default OrderManagement;