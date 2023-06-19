import React from "react";

const Input = ({ label = "", name = "", type = "text",className='',isRequired='false',placeholder='',value='', onChange=()=>{} }) => {
  return (
    <div>
      <label
        for={name}
        className="flex mb-2 text-sm font-medium text-gray-900 justify-start"
      >{label}</label>
      <input className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 mb-7 ${className}`} type={type} id={name} placeholder={placeholder} required={isRequired} value={value} onChange={onChange}></input>
    </div>
  );
};

export default Input;
