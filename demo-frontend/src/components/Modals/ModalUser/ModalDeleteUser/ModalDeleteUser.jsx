import { IoMdClose } from "react-icons/io";
import ContainerModal from "../../ContainerModal/ContainerModal";
import { useDispatch, useSelector } from "react-redux";
import { closeUserModal, closeUserModalRefresh } from "../../../../stores/userSlice";
import { deleteUser } from "../../../../apis/userAPI";

const ModalDeleteUser = () => {

    const users = useSelector((state) => state.users);

    const dispatch= useDispatch();
    const handleCloseModal = () => {
        dispatch(closeUserModal());
    };
    const handleDelete = async () => {
        try {
            let res = await deleteUser(users.modal.user.id);
            if(res.statusCode === 200) {
                dispatch(closeUserModalRefresh());
                return;
            }
        } catch (error) {
            
        }
    }
    return ( 
        <ContainerModal closeModal={handleCloseModal}>
            <div className="ModalDeleteUser rounded-xl bg-white w-1/3 px-10 py-10 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-red-600">Delete User</p>
                    <IoMdClose className="text-red-500 text-2xl" onClick={handleCloseModal }/>
                </div>
                <div>
                    <p className="text-gray-700">Are you sure you want to delete this user?</p>
                    <div className="flex gap-2">
                        <p className="font-bold">Username: </p>
                        <p className="text-gray-700">{users.modal.user.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="font-bold">Email: </p>
                        <p  className="text-gray-700">{users.modal.user.email}</p>
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
 
export default ModalDeleteUser;