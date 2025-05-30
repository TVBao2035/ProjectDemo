import { IoMdClose } from "react-icons/io";
import ContainerModal from "../../ContainerModal/ContainerModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createOrder, updateOrder } from "../../../../apis/orderAPI";
import { closeOrderModal, closeOrderModalRefresh } from "../../../../stores/orderSlice";
import useDebounce from "../../../../hooks/useDebound";
import { searchProducts } from "../../../../apis/productAPI";
import { searchUsers } from "../../../../apis/userAPI";
import Input from "../../../Input";

const ModalUpdateOrder = () => {
    const orders = useSelector(state => state.orders);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const handleCloseModal = () => {
        dispatch(closeOrderModal());
    }
  

    const [searchValue, setSearchValue] = useState({
            isUserHide: true,
            isProductHide: true,
            userSearch: orders.modal.order.user.name,
            productSearch: orders.modal.order.product.name
        });
        const [value, setValue] = useState({
            id: orders.modal.order.id,
            userId: orders.modal.order.user.id,
            productId: orders.modal.order.product.id
        })
        const [list, setList] = useState({
            userList:[],
            productList: []
        });

    const deboundceProduct = useDebounce(searchValue.productSearch, 500);
    const deboundceUser = useDebounce(searchValue.userSearch, 500);

    const handleUpdate = async () => {
        try {
             if(searchValue.userSearch.trim().length ===0 ) {
                setError("Please choose user");
                return;
            }

             if(searchValue.productSearch.trim().length ===0 ) {
                setError("Please choose product");
                return;
            }
            let res = await updateOrder(value);
            if(res.statusCode === 200){
                dispatch(closeOrderModalRefresh());
            }else{
                setError(res.message);
            }
        } catch (error) {
            alert(error);
        }
    }
    const handleGetUsers = async ( value ) => {
        try {
            let res = await searchUsers({
                pageIndex: 1,
                pageSize: 100,
                filters:[{ fieldName: "name", value}],
                sort:{
                    fieldName: "name",
                    isASC: true
                }
            });
            if(res?.statusCode === 200){
                setList(prev => ({
                    ...prev,
                    userList: res.data.searchData
                }))
            }
        } catch (error) {
            
        }
    }
    const handleGetProducts = async (value) => {
        try {
            let res = await searchProducts({
                pageIndex: 1,
                pageSize: 100,
                filters:[{fieldName: "name",}],
                sort:{fieldName: "name",isASC: true}
            });
            if(res.statusCode === 200){
                  setList(prev => ({
                        ...prev,
                        productList: res.data.searchData
                    }))
                return;
            }
        } catch (error) {
            
        }
    }

    const handleClickItemProduct = (id, name) => {
        setSearchValue(prev => ({
            ...prev,
            productSearch: name,
            isProductHide: true
        }));
        setValue(prev => ({...prev, productId: id }))
        setList(prev => ({...prev, productList: []}))
    }
    
    const handleClickItemUser = (id,name) => {
        setSearchValue(prev => ({
            ...prev,
            userSearch: name,
            isUserHide: true
        }));
        setValue(prev => ({...prev, userId: id }));
        setList(prev => ({...prev, userList: []}))
    }
    
    
    const handleChangeUser = (e) => {
        setSearchValue(prev => ({...prev, userSearch: e.target.value, isUserHide: false}));
    }
    const handleChangeProduct = (e) => {
         setSearchValue(prev => ({...prev, productSearch: e.target.value, isProductHide: false}));
    }
    useEffect(() => {
        if(!searchValue.isUserHide){
            if(deboundceUser.trim().length !== 0) handleGetUsers(deboundceUser);
            setList(prev => ({...prev, userList: []}));
        }
    }, [deboundceUser]);
    
    useEffect(()=>{
        if(!searchValue.isProductHide){
            if(deboundceProduct.trim().length !== 0) handleGetProducts(deboundceProduct);
            setList(prev => ({...prev, productList: []}));
        }
    }, [deboundceProduct]);
    
    return ( 
           <ContainerModal closeModal={handleCloseModal}>
               <div className="ModalCreateUser rounded-xl bg-white w-1/3 px-10 py-10 flex flex-col gap-8">
                   <div className="flex justify-between items-center">
                       <p className="text-2xl font-bold text-yellow-600">Update Order</p>
                       <IoMdClose className="text-red-500 text-2xl" onClick={handleCloseModal }/>
                   </div>
                   <div className="flex gap-2">
                    <div className="relative">
                        <Input
                            lable={"Product Name"}
                            name={"product"}
                            value={searchValue.productSearch}
                            onChange={handleChangeProduct}
                        />
                        {
                            list.productList.length !== 0 && 
                            <div className="absolute z-12  w-full">
                                {
                                    list.productList.map(product => {
                                        return (
                                            <div className=" px-2 py-1  bg-[#4b4b4b] text-white hover:bg-blue-300" onClick={() => handleClickItemProduct(product.id, product.name)} >{product.name}</div>
                                        )})
                                }
                            </div>
                        }
                    </div>
                    <div className="relative">
                        <Input
                            lable={"User Name"}
                            name={"user"}
                            value={searchValue.userSearch}
                            onChange={handleChangeUser}
                        />
                        {
                            list.userList.length !== 0 && 
                            <div className="absolute bg-black text-white w-full z-11 ">
                                {
                                    list.userList.map(user => {
                                        return (
                                            <div className=" px-2 py-1 bg-[#4b4b4b] text-white hover:bg-blue-300" onClick={() => handleClickItemUser(user.id, user.name)} >{user.name}</div>
                                        )})
                                }
                            </div>
                        }
                    </div>
                </div>
                   <div className="flex flex-col items-center justify-center">
                       <button 
                           onClick={handleUpdate}
                           className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-300 active:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                             Update
                         </button>
                         <p className="text-red-500">{error}</p    >
                   </div>
               </div>
           </ContainerModal>
        );
}
 
export default ModalUpdateOrder;