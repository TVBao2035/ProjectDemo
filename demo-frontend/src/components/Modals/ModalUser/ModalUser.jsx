import { useSelector } from "react-redux";
import { Fragment } from "react/jsx-runtime";
import { ModalType } from "../../../Consts";
import ModalCreteUser from "./ModalCreateUser";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalDeleteUser from "./ModalDeleteUser";


const ModalUser = () => {
    const users = useSelector(state => state.users)
    return ( 
        <Fragment>
            {
                   users.modal.isOpen && 
                   (
                       users.modal.type === ModalType.CREATE &&
                       <ModalCreteUser />

                   ) || 
                   (
                       users.modal.type === ModalType.EDIT &&
                        <ModalUpdateUser/>
                   ) ||
                   (
                       users.modal.type === ModalType.DELETE &&
                       <ModalDeleteUser />
                   )
           }
           
        </Fragment>
     );
}
 
export default ModalUser;