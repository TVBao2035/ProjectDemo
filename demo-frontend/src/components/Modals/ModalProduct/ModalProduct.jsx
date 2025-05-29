import { Fragment } from "react/jsx-runtime";
import ContainerModal from "../ContainerModal/ContainerModal";
import { useSelector } from "react-redux";
import { ModalType } from "../../../Consts";
import ModalCreateProduct from "./ModalCreateProduct";
import ModalDeleteProduct from "./ModalDeleteProduct";
import ModalUpdateProduct from "./ModalUpdateProduct";

const ModalProduct = () => {
    const productModal = useSelector(state => state.products.modal);
    return ( 
        <Fragment>
            {
                productModal.isOpen && 
                (
                    productModal.type === ModalType.CREATE && <ModalCreateProduct/>
                ) ||
                (
                    productModal.type === ModalType.DELETE && <ModalDeleteProduct/>
                ) ||
                (
                    productModal.type === ModalType.EDIT && <ModalUpdateProduct />
                )
            }
        </Fragment>
    );
}
 
export default ModalProduct;