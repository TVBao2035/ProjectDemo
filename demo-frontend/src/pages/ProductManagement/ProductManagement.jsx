import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebound";
import { TiArrowUnsorted } from "react-icons/ti";
import { FaRegEdit, FaUserPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { HiArrowLeftCircle, HiArrowRightCircle } from "react-icons/hi2";
import { searchProducts } from "../../apis/productAPI";
import { openProductModal, setProducts } from "../../stores/productSlice";
import { MdOutlineAddCircle } from "react-icons/md";
import ModalProduct from "../../components/Modals/ModalProduct";
import { ModalType } from "../../Consts";
import { openOrderModal } from "../../stores/orderSlice";
const ProductManagement = () => {
     const initialSearch = {
        pageIndex: 1,
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
    const products = useSelector((state) => state.products);

    const [searchValue, setSearchValue] = useState("");
    const [search, setSearch] = useState(initialSearch);
    const [paging, setPaging] = useState(initPaging);

    const deboundSearch = useDebounce(searchValue, 900);
    

    const handleGetProducts = async () => {
        try {
            let res = await searchProducts(search);
            if(res.statusCode === 200){
                dispatch(setProducts(res.data.searchData));
                setPaging({
                    totalPage: res.data.totalPages
                });
                return;
            }
        } catch (error) {
            
        }
    }

    const handleSortByName = () => {
        setSearch(prev => ({
            ...prev,
            sort: {
                fieldName: "name",
                isASC: !prev.sort.isASC
            }
        }));
    }
    const handleSortByPrice = () => {
        setSearch(prev => ({
            ...prev,
            sort: {
                fieldName: "price",
                isASC: !prev.sort.isASC
            }
        }));
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
            setSearch(prev => ({ ...prev, pageIndex: 1, filters: [{ fieldName: "name", value: deboundSearch }] }));
    }, [deboundSearch]);

    useEffect(() => {
         if(auth.data){
             handleGetProducts();
         }
    }, [auth, search, products.modal.count] );
    return (
        <div className="ProductManagement flex flex-col justify-between px-40 relative">
                    <ModalProduct/>
                    <div className="flex justify-between mt-3">
                        <div className="flex items-center w-1/2 ">
                            <input type="text" 
                                className="border w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="enter here " />
                        </div>
                        <MdOutlineAddCircle className="text-4xl  hover:text-blue-400  text-blue-500" onClick={()=> dispatch(openProductModal({product: null, type: ModalType.CREATE}))}/>
                    </div>
                    <table className="table-fixed border border-gray-200 shadow-2xl mt-10">
                        <thead className="bg-gradient-to-r from-blue-400 to-blue-700 w-3/4 mt-10 text-white select-none">
                            <tr className="">
                                <th className="px-6 py-3"  scope="col">
                                    <p>Id</p>
                                </th>
                                <th className="px-6 py-3"  scope="col">
                                    <div className="flex gap-2 items-center">
                                        <p>Name</p>
                                        <TiArrowUnsorted onClick={handleSortByName} className=" active:text-blue-100 hover:ring-1 hover:ring-white rounded-full"/>
                                    </div> 
                                </th>
                                <th className="px-6 py-3"  scope="col">
                                    <div className="flex gap-2 items-center">
                                        <p>Price</p>
                                        <TiArrowUnsorted onClick={handleSortByPrice} className=" active:text-blue-100 hover:ring-1 hover:ring-white rounded-full"/>
                                    </div>
                                </th>
                                <th className="px-6 py-3"  scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products?.data?.length !== 0 ? 
                                products?.data?.map((product, index) => {
                                    return (
                                    <tr key={index} className="hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white  border border-gray-200 hover:ring-1 hover:ring-blue-500" >
                                        <td className="px-6 py-4">{product.id}</td>
                                        <td className="px-6 py-4">{product.name}</td>
                                        <td className="px-6 py-4">{product.price}</td>
                                        <td className="flex gap-5 px-6 py-4 items-center">
                                            <FaRegEdit className="text-xl text-yellow-600 hover:text-yellow-300" 
                                                onClick={() => dispatch(openProductModal({product, type: ModalType.EDIT}))}
                                            />
                                            <MdDeleteOutline className="text-2xl text-red-700 hover:text-red-400" 
                                                onClick={() => dispatch(openProductModal({product, type: ModalType.DELETE}))}
                                            />
                                        </td>
                                    </tr>
                                    );
                                }):
                                (
                                   <tr key={"894343"} className="hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white  border border-gray-200 hover:ring-1 hover:ring-blue-500" >
                                        <td className="px-6 py-4 text-center" colSpan={4}>No  found</td>
                                    </tr>
                                )
                            }
                            
        
                        </tbody>
                    </table>
        
                    <div className="fixed bottom-40 w-full start-0 ">
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
 
export default ProductManagement;