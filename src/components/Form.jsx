import React from 'react';
import Input from './Input';
import Button from './Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Form = ({
    isSignUp=true,
}) => {
  
const[data,setData]=useState({
    ...(!isSignUp && {
        fullName:''
    }),
    email:'',
    password:''
})
const navigate=useNavigate();
const handleSubmit=async(e)=>{
//console.log(data);
e.preventDefault();
const res=await fetch(`http://localhost:8000/api/${isSignUp?'register':'login'}`,{
    method:'POST',
    headers:{
        'Content-type':'application/json'
    },
    body: JSON.stringify(data)
})

if(res.status===400){
    alert('Invalid credentials')
}else{
const resData=await res.json()
if(resData.token){
    localStorage.setItem('user:token',resData.token)
    localStorage.setItem('user:detail',JSON.stringify(resData.user))
    navigate('/')
}
}

//console.log(resData);
}

//console.log(data);
    return (
        <div className='bg-white w-[400px] h-[600px] shadow-lg rounded-lg flex flex-col items-center justify-center'>
            <div className=' mb-2 text-3xl font-bold'>
                Welcome {!isSignUp&&'Back!'}
            </div>
            <div className='text-l mb-10'>
              {isSignUp?"Sign up to continue":"Sign in to explore"}  
            </div>

            <form className='w-full flex flex-col justify-center items-center' onSubmit={(e)=>handleSubmit(e)}>
          {isSignUp && <Input label="Full Name" name="name" placeholder='Enter your full name' isRequired='true' value={data.fullName} onChange={(e)=>setData({...data,fullName:e.target.value})}/>}
            <Input label="Email address" name="email" type='email' placeholder='Enter your email' isRequired="true" value={data.email} onChange={(e)=>setData({...data,email:e.target.value})}/>
            <Input label="Password" name="password" type="password" placeholder='Enter your password' isRequired="true" value={data.password} onChange={(e)=>setData({...data,password:e.target.value})}/>
            <Button label={isSignUp?"Sign Up":"Sign In"} type="submit" />
            </form>
            <div>{isSignUp ?"Already have an account?":"Dont have an account?"}<span className='text-blue-500 cursor-pointer' onClick={()=>navigate(`/${isSignUp ? "sign_in":"sign_up"}`)}>{isSignUp ?"Sign In":"Sign up"}</span></div>
        </div>
    );
}

export default  Form;
 