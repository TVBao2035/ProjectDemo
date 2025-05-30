import { useDispatch, useSelector } from "react-redux";
import ContainerModal from "../../ContainerModal/ContainerModal";
import { IoMdClose } from "react-icons/io";
import Input from "../../../Input";
import { useState } from "react";
import { closeProductModal, closeProductModalRefresh } from "../../../../stores/productSlice";
import { updateProduct } from "../../../../apis/productAPI";

const ModalUpdateProduct = () => {
    const products = useSelector(state =>state.products);
    const [infor, setInfor] = useState(products.modal.product)
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const handleCloseModal = () => {
        dispatch(closeProductModal());
    }

    const handleChange = (e) => {
        if(error.length !== 0) setError("");
         setInfor(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleUpdate  = async () => {
            try {

                if(infor.name.trim().length === 0) {
                    setError("Please enter product name");
                    return;
                }

                if(infor.price === 0){
                      setError("Please enter product price");
                    return;
                }
                let res = await updateProduct(infor);
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
            <div className="ModalUpdateUser rounded-xl bg-white w-1/3 px-10 py-10 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-yellow-600">Update Product</p>
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
                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            </div>
        </ContainerModal>
      );
}
 
export default ModalUpdateProduct;