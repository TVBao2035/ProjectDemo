import { useDispatch, useSelector } from "react-redux";
import { getUsers, searchUsers } from "../../apis/userAPI";
import { openUserModal, setUsers } from "../../stores/userSlice";
import { use, useEffect, useState } from "react";
import { TiArrowUnsorted } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { HiArrowLeftCircle, HiArrowRightCircle } from "react-icons/hi2"
import { FaUserPlus } from "react-icons/fa6";
import useDebounce from "../../hooks/useDebound";
import { ModalType } from "../../Consts";
import { ModalUser } from "../../components/Modals";

const UserManagement = () => {
    const initialSearch = {
        pageIndex: 1,
        pageSize: 9,
        filters:[],
        sort:{
            fieldName: "name",
            isASC: true
        }
    }
    const initPaging = {
        totalPage: 1
    }


    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const users = useSelector((state) => state.users);

    const [searchValue, setSearchValue] = useState("");
    const [search, setSearch] = useState(initialSearch);
    const [paging, setPaging] = useState(initPaging);

    const deboundSearch = useDebounce(searchValue, 900);

    const handleGetUsers = async ( ) => {
        try {
            let res = await searchUsers(search);
            if(res?.statusCode === 200){
                setPaging({
                    totalPage: res.data.totalPages
                })
                dispatch(setUsers(res.data.searchData));
            }
        } catch (error) {
            
        }
    }

    const handleNext = () => {
        if(search.pageIndex < paging.totalPage) {
            setSearch(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
        }
    }

    const handlePrevious = () => {
        if(search.pageIndex > 1){
            setSearch(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
        }
    }

    const handleSortByEmail = () => {
        setSearch(prev => ({
            ...prev,
            sort:{
                fieldName: "email",
                isASC: !prev.sort.isASC
            }
        }));
    }

    const handlSortByName = () => {
        setSearch(prev => ({
            ...prev,
            sort:{
                fieldName: "name",
                isASC: !prev.sort.isASC
            }
        }))
    }

    useEffect(() => {
        setSearch(prev => ({
            ...prev,
            filters: [
                {
                    fieldName: "name",
                    value: deboundSearch
                }
            ],
            pageIndex: 1
        }));
    }, [deboundSearch])


    useEffect(() => {
        if(auth.data){
            handleGetUsers();
        }
    }, [search, auth, users.modal.count]);
    return ( 
        <div className="UserManagement flex flex-col justify-between px-40 relative">
            <ModalUser/>
            <div className="flex justify-between mt-3">
                <div className="flex items-center w-1/2 ">
                    <input type="text" 
                        className="border w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Enter user name " />
                </div>
                <FaUserPlus className="text-5xl rounded-full px-3 py-3 hover:bg-blue-400  bg-blue-500 text-white" onClick={() => dispatch(openUserModal({user: null, type: ModalType.CREATE}))}/>
            </div>
            <table className="table-fixed border border-gray-200 shadow-2xl mt-10">
                <thead className="bg-gradient-to-r from-blue-400 to-blue-700 w-3/4 mt-10 text-white select-none">
                    <tr className="">
                        <th className="px-6 py-3"  scope="col">
                            <p>Id</p>
                        </th>
                        <th className="px-6 py-3"  scope="col">
                            <div className="flex gap-2 items-center">
                                <p>Name</p>
                                <TiArrowUnsorted onClick={handlSortByName} className=" active:text-blue-100 hover:ring-1 hover:ring-white rounded-full"/>
                            </div> 
                        </th>
                        <th className="px-6 py-3"  scope="col">
                            <div className="flex gap-2 items-center">
                                <p>Email</p>
                                <TiArrowUnsorted onClick={handleSortByEmail} className=" active:text-blue-100 hover:ring-1 hover:ring-white rounded-full"/>
                            </div>
                        </th>
                        <th className="px-6 py-3"  scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {
                        users?.data?.length !== 0 ? 
                        users?.data?.map((user, index) => {
                            return (
                            <tr key={index} className="hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white  border border-gray-200 hover:ring-1 hover:ring-blue-500" >
                                <td className="px-6 py-4">{user.id}</td>
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="flex gap-5 px-6 py-4 items-center">
                                    <FaRegEdit className="text-xl text-yellow-600 hover:text-yellow-300" 
                                        onClick={() => dispatch(openUserModal({user, type: ModalType.EDIT}))}
                                     />
                                    <MdDeleteOutline className="text-2xl text-red-700 hover:text-red-400" 
                                        onClick={() => dispatch(openUserModal({user, type: ModalType.DELETE}))}
                                    />
                                </td>
                            </tr>
                            );
                        }):
                        (
                           <tr key={"873438"} className="hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white  border border-gray-200 hover:ring-1 hover:ring-blue-500" >
                                <td className="px-6 py-4 text-center" colSpan={4}>No users found</td>
                            </tr>
                        )
                    }
                    

                </tbody>
            </table>

            <div className="fixed bottom-40 w-full start-0 ">
                <div className="flex gap-3 items-center justify-center mt-5">
                    <HiArrowLeftCircle
                        className={`text-3xl ${search.pageIndex === 1 ? "text-gray-500" : "text-blue-500 active:text-blue-400 hover:ring-2 hover:rounded-full hover:ring-blue-500 "} `}
                        onClick={handlePrevious}
                    />
                    <div className="text-xl select-none text-blue-500 font-bold" >{search.pageIndex}</div>
                    <HiArrowRightCircle 
                        className={`text-3xl   ${paging.totalPage === search.pageIndex ? "text-gray-500" : "text-blue-500 active:text-blue-400 hover:ring-2 hover:rounded-full hover:ring-blue-500"}`} 
                        onClick={handleNext}/>

                </div>
            </div>
        </div>
     );
}
 
export default UserManagement;
