import React from "react";

const Button = ({
    label='',
    type='',
    className=''

}) => {
  return (
    <div className="w-full">
      <button type={type} label={label} className={`bg-primary hover:bg-blue-500  text-white font-bold py-2 px-4 w-1/2 ${className}`}>
        {label}
      </button>
    </div>
  );
};

export default Button;
