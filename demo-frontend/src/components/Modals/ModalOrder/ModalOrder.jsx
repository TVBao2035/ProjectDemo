import { useSelector } from "react-redux";
import { Fragment } from "react/jsx-runtime";
import { ModalType } from "../../../Consts";
import ModalCreateOrder from "./ModalCreateOrder";
import ModalUpdateOrder from "./ModalUpdateOrder/ModalUpdateOrder";
import ModalDeleteOrder from "./ModalDeleteOrder";

const ModalOrder = () => {
    const orders = useSelector(state => state.orders);
    return ( 
       <Fragment>
        {
            orders.modal.isOpen &&
             (
                orders.modal.type === ModalType.CREATE && <ModalCreateOrder/>
            ) ||
            (
                orders.modal.type === ModalType.EDIT && <ModalUpdateOrder/>
            ) ||
            (
                orders.modal.type === ModalType.DELETE && <ModalDeleteOrder/>
            )
        }
       </Fragment>
     );
}
 
export default ModalOrder;