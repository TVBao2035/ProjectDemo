import { IoMdClose } from "react-icons/io";
import ContainerModal from "../../ContainerModal/ContainerModal";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { createOrder } from "../../../../apis/orderAPI";
import { closeOrderModal, closeOrderModalRefresh } from "../../../../stores/orderSlice";
import { searchUsers } from "../../../../apis/userAPI";
import { searchProducts } from "../../../../apis/productAPI";
import useDebounce from "../../../../hooks/useDebound";
import Input from "../../../Input";

const ModalCreateOrder = () => {

    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const handleCloseModal = () => {
        dispatch(closeOrderModal());
    }

    const [searchValue, setSearchValue] = useState({
        userSearch: "",
        productSearch: ""
    });
    const [value, setValue] = useState({
        userId: null,
        productId: null
    })
    const [list, setList] = useState({
        userList:[],
        productList: []
    });

    const deboundceProduct = useDebounce(searchValue.productSearch, 500);
    const deboundceUser = useDebounce(searchValue.userSearch, 500);


 

    const handleSubmit = async () => {
        try {
            let res = await createOrder(value);
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
                    filters:[
                        {
                            fieldName: "name",
                            value
                        }
                    ],
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
                        filters:[
                            {
                                fieldName: "name",
                                value
                            }
                        ],
                        sort:{
                            fieldName: "name",
                            isASC: true
                        }
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
    const handleClickItemProduct = (id) => {
        setValue(prev => ({...prev, productId: id }))
        setList(prev => ({...prev, productList: []}))
    }
    const handleClickItemUser = (id) => {
         setValue(prev => ({...prev, userId: id }));
         setList(prev => ({...prev, userList: []}))
    }
    useEffect(() => {
        if(deboundceUser.trim().length !== 0)
            handleGetUsers(deboundceUser);
    }, [deboundceUser])
    useEffect(()=>{
        if(deboundceProduct.trim().length !== 0)
            handleGetProducts(deboundceProduct);
    }, [deboundceProduct])
    return ( 
        <ContainerModal closeModal={handleCloseModal}>
            <div className="ModalCreateUser rounded-xl bg-white w-1/3 px-10 py-10 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-blue-600">Create Order</p>
                    <IoMdClose className="text-red-500 text-2xl" onClick={handleCloseModal }/>
                </div>
                <div>
                    <div className="relative">
                        <Input 
                            lable={"Product Name"}
                            name={"product"}
                            value={searchValue.productSearch}
                            onChange={(e) => setSearchValue(prev => ({...prev, productSearch: e.target.value}))}
                        />
                        {
                            list.productList.length !== 0 && 
                            <div className="absolute">
                                {
                                    list.productList.map(product => {
                                        return (
                                            <div onClick={() => handleClickItemProduct(product.id)} >{product.name}</div>
                                        )})
                                }
                            </div>
                        }
                    </div>
                    <div>
                        <Input 
                            lable={"User Name"}
                            name={"user"}
                            value={searchValue.userSearch}
                            onChange={(e) => setSearchValue(prev => ({...prev, userSearch: e.target.value}))}
                        />
                        {
                            list.userList.length !== 0 && 
                            <div className="absolute">
                                {
                                    list.userList.map(user => {
                                        return (
                                            <div onClick={() => handleClickItemUser(user.id)} >{user.name}</div>
                                        )})
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <button 
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                          Submit
                      </button>
                      <p className="text-red-500">{error}</p    >
                </div>
            </div>
        </ContainerModal>
     );
}
 
export default ModalCreateOrder;