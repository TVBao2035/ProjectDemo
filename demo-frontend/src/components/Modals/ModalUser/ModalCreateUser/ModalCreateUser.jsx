import { use, useState } from "react";
import Input from "../../../Input";
import ContainerModal from "../../ContainerModal/ContainerModal";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { closeUserModal, closeUserModalRefresh } from "../../../../stores/userSlice";
import { createUser } from "../../../../apis/userAPI";
const ModalCreteUser = () => {
    const users = useSelector((state) => state.users);
    const [infor, setInfor] = useState({
        name: "",
        email: ""
    })
    const [error, setError] = useState("");
    const dispatch = useDispatch();


    const handleCloseModal = () =>{ 
        dispatch(closeUserModal());
    }
    const handleChange = (e) => {
        setInfor(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    }
    const handleSubmit = async () => {
        try {
             if(infor.name.trim().length ===  0 || infor.email.trim().length === 0) {
                setError("Name and email cannot be empty");
                return;
            }   
            if(!infor.email.includes("@")) {
                setError("Email is not valid");
                return;
            }
            let res = await createUser(infor);
            if(res.statusCode === 200) {
                dispatch(closeUserModalRefresh());
                return;
            }
            setError(res.message);
        } catch (error) {
            alert("Error creating user: " + error.message);
        }
    }
    return ( 
        <ContainerModal closeModal={handleCloseModal}>
            <div className="ModalCreateUser rounded-xl bg-white w-1/3 px-10 py-10 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-blue-600">Create User</p>
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
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                          Submit
                      </button>
                      <p className="text-red-500">{error}</p>
                </div>
            </div>
        </ContainerModal>
     );
}
 
export default ModalCreteUser;