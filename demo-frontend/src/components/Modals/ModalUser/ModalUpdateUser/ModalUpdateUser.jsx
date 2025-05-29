import { IoMdClose } from "react-icons/io";
import ContainerModal from "../../ContainerModal/ContainerModal";
import { useDispatch, useSelector } from "react-redux";
import { closeUserModal, closeUserModalRefresh } from "../../../../stores/userSlice";
import Input from "../../../Input";
import { updateUser } from "../../../../apis/userAPI";
import { useState } from "react";

const ModalUpdateUser = () => {
    const users = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const [infor, setInfor] = useState(users?.modal?.user);
    const [error, setError] = useState("");

    const handleCloseModal = () => {
        dispatch(closeUserModal());
    };

    const handleUpdate = async () => {
        try {
            if(infor.name.trim().length ===  0 || infor.email.trim().length === 0) {
                setError("Name and email cannot be empty");
                return;
            }   
            if(!infor.email.includes("@")) {
                setError("Email is not valid");
                return;
            }
            let res = await updateUser(infor)
            if(res.statusCode === 200) {
                dispatch(closeUserModalRefresh());
                return;
            }
            setError(res.message);
        } catch (error) {
            
        }
    }
    const handleChange = (e) => {
        setInfor(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };
    return ( 
        <ContainerModal closeModal={handleCloseModal}>
            <div className="ModalUpdateUser rounded-xl bg-white w-1/3 px-10 py-10 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-yellow-600">Update User</p>
                    <IoMdClose className="text-red-500 text-2xl" onClick={handleCloseModal }/>
                </div>
                <div>
                    <Input 
                        lable={"Name"}
                        type="text"
                        name="name"
                        value={infor.name}
                        placeholder="Enter your name"
                        onChange={handleChange}
                    />
                    <Input 
                        lable={"Email"}
                        type="email"
                        name="email"
                        value={infor.email}
                        placeholder="Enter your email"
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
 
export default ModalUpdateUser;