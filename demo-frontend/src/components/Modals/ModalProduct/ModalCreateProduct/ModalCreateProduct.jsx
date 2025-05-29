import { useState } from "react";
import ContainerModal from "../../ContainerModal/ContainerModal";
import { IoMdClose } from "react-icons/io";
import Input from "../../../Input";
import { useDispatch } from "react-redux";
import { closeProductModal, closeProductModalRefresh } from "../../../../stores/productSlice";
import { createProduct } from "../../../../apis/productAPI";


const ModalCreateProduct = () => {

    const [infor, setInfor] = useState({
        name: "",
        price: 0
    })
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const handleCloseModal = () => {
        dispatch(closeProductModal());
    }

    const handleChange = (e) => {
        if(error.length !== 0) setError("");
         setInfor(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async () => {
        try {
            let res = await createProduct(infor);
            if(res.statusCode === 200){
                dispatch(closeProductModalRefresh());
            }else{
                setError(res.message);
            }
        } catch (error) {
            alert(error);
        }
    }
    return ( 
        <ContainerModal closeModal={handleCloseModal}>
            <div className="ModalCreateUser rounded-xl bg-white w-1/3 px-10 py-10 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-blue-600">Create Product</p>
                    <IoMdClose className="text-red-500 text-2xl" onClick={handleCloseModal }/>
                </div>
                <div>
                    <Input
                        lable={"Name"}
                        type="text"
                        name="name"
                        value={infor.name}
                        placeholder="Enter product name"
                        onChange={handleChange}
                    />
                    <Input
                        lable={"Price"}
                        type="number"
                        name="price"
                        value={infor.price}
                        placeholder="Enter price"
                        onChange={handleChange}
                    />
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
 
export default ModalCreateProduct;