import { IoMdClose } from "react-icons/io";
import ContainerModal from "../../ContainerModal/ContainerModal";
import { useDispatch, useSelector } from "react-redux";
import { closeOrderModal } from "../../../../stores/orderSlice";

const ModalDeleteOrder = () => {
    const order = useSelector(state => state.orders.modal.order);
    const dispatch = useDispatch();



    const handleDelete = async () => {

    }
     const handleCloseModal = () => {
            dispatch(closeOrderModal());
        }
    return ( 
        <ContainerModal closeModal={handleCloseModal}>
            <div className="ModalDeleteProduct rounded-xl bg-white w-1/3 px-10 py-10 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-red-600">Delete Order</p>
                    <IoMdClose className="text-red-500 text-2xl" onClick={handleCloseModal }/>
                </div>
                <div>
                    <p className="text-gray-700">Are you sure you want to delete this order?</p>
                    <div className="flex gap-2">
                        <p className="font-bold">Product Name: </p>
                        <p className="text-gray-700">{order?.product.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="font-bold">User Name: </p>
                        <p  className="text-gray-700">{order?.user.name}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <button 
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>  
        </ContainerModal>
     );
}
 
export default ModalDeleteOrder;