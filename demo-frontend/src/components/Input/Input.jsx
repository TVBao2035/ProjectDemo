


const Input = ({lable, type="text", name, value, message, onChange=()=>{}}) => {
    return (
        <div className="Input flex flex-col gap-1">
            <label className="font-bold text-blue-800">{lable}</label>
            <input
                name={name}
                value={value}
                onChange={onChange} 
                type={type} className="outline-none border focus:ring-blue-500 focus:border-blue-500 border-2 border-blue-300 px-2 py-1 rounded-md" />
            <span className="text-red-500">{message}</span>
        </div>
);
}
 
export default Input;