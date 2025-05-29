const ContainerModal = ({children, closeModal = () => {}}) => {
    return ( 
        <div onDoubleClick={(e) => 
        {
            if(e.target === e.currentTarget) closeModal();
        }
        } className="fixed  top-0 left-0 bg-[#2c2c2c7e] w-full h-full z-10 flex justify-center items-center">
            {children}
        </div>
     );
}
 
export default ContainerModal;