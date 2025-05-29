import { IoMdClose } from "react-icons/io";
import ContainerModal from "../../ContainerModal/ContainerModal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createOrder } from "../../../../apis/orderAPI";
import { closeOrderModal, closeOrderModalRefresh } from "../../../../stores/orderSlice";

const ModalUpdateOrder = () => {
        const orders = useSelector(state => state.orders);
        const [infor, setInfor] = useState(orders.modal.order)
       const [error, setError] = useState("");
       const dispatch = useDispatch();
       const handleCloseModal = () => {
           dispatch(closeOrderModal());
       }
   
       const handleChange = (e) => {
           if(error.length !== 0) setError("");
            setInfor(prev => ({ ...prev, [e.target.name]: e.target.value }));
       }
   
       const handleUpdate = async () => {
           try {
               let res = await createOrder(infor);
               if(res.statusCode === 200){
                   dispatch(closeOrderModalRefresh());
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
                       <p className="text-2xl font-bold text-yellow-600">Update Order</p>
                       <IoMdClose className="text-red-500 text-2xl" onClick={handleCloseModal }/>
                   </div>
                   <div>
                       
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