import React, { useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import Img from "../assets/user.png";
import send from "../assets/send-button.png";
import {io} from 'socket.io-client'

const Dashboard = () => {



  useEffect(() => {
    const logedInUser = JSON.parse(localStorage.getItem("user:detail"));
    const fetchChats = async () => {
      const res = await fetch(
        `http://localhost:8000/api/chat/${logedInUser?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await res.json();
      //console.log(resData);
      setChats(resData);
    };
    fetchChats();
  }, []);

  const fetchMessages = async (chatId, receiver) => {
    const response = await fetch(
      `http://localhost:8000/api/message/${chatId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await response.json();
     
    setMessages({ messages: resData, receiver, chatId });
  };

  useEffect(() => {
    //const logedInUser=JSON.parse(localStorage.getItem('user:detail'))
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
     // console.log(resData);
      setUsers( resData);
    };
    fetchUsers();
  }, []);

  const sendMessage = async (e) => {
    socket?.emit('sendMessage',{
       chatId: messages?.chatId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiver?.receiverId,
    })
   // console.log('sendmessage',messages?.chatId,user?.id,message,messages?.receiver?.receiverId)
    const res = await fetch(`http://localhost:8000/api/message`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },

      body: JSON.stringify({
        chatId: messages?.chatId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiver?.receiverId,
      }),
    });

    setMessage("");
  };


const createChat=async(e)=>{
const res = await fetch(`http://localhost:8000/api/chat`,{
  method:"POST",
  header:{
    "Content-type":"application/json"
  },
  body:JSON.stringify({
    senderId:user?.id,
    receiverId:messages?.receiver?.receiverId,
  })
});
}

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const[socket,setSocket]=useState(null);
  const messageRef=useRef()
  //console.log(user);
  //console.log("chats>>",chats);
  //console.log("messages>>",messages);       

  useEffect(()=>{
    setSocket(io())
  },[])

  useEffect(()=>{
    socket?.emit('addUser',user?.id);
    socket?.on('getUsers',users=>{
      //console.log('activeUsers:>>',users);
    })
     socket?.on('getMessage',data=>{
      //console.log('data:>>',data);
      setMessages(prev=>({
        ...prev,
        messages:[...prev.messages,{user:data.user,message:data.message}]
      }))
     })
  },[socket])  


  useEffect(()=>{
messageRef?.current?.scrollIntoView({behaviour:'smooth'})
  },[messages?.messages])


  return (
    <div className="w-screen h-screen flex">
      <div className="w-[25%] bg-white">
        <div className="flex justify-center items-center my-8 gap-4">
          <div className=" border border-primary p-[2px] rounded-full">
            {" "}
            <img src="src/assets/user.png" width={65} height={65} />
          </div>
          <div className="flex flex-col justify-start items-start ">
            <h3 className="text-xl">{user?.fullName}</h3>
            <p className="text-sm font-light">My Account</p>
          </div>
        </div>
        <hr />

        <div className="h-[75%]">
          <div className="font-primary">Messages</div>

          <div className="overflow-scroll h-[600px]">
            {" "}
            {chats.length > 0 ? (
              chats.map(({ chatId, receiver }) => {
                return (
                  <div>
                    <div
                      className="flex my-3 gap-5 cursor-pointer"
                      onClick={() => fetchMessages(chatId, receiver)}
                    >
                      <div className=" border border-primary p-[2px] rounded-full">
                        <img src={Img} width={50} height={50} />
                      </div>
                      <div className="flex flex-col  items-start">
                        <h3 className="text-lg">{receiver?.fullName}</h3>
                        <p className="text-sm font-light">{receiver?.email}</p>
                      </div>
                    </div>
                    <hr />
                  </div>
                );
              })
            ) : (
              <div className="text-md font-black mt-5">No new Conversation</div>
            )}
          </div>
        </div>
      </div>
      :
      <div className="w-[50%] h-screen flex flex-col bg-white">
        {messages?.receiver?.fullName && (
          <div className="bg-white p-2 ">
            <div className="flex justify-start items-center  gap-4">
              <div className=" border border-primary p-[2px] rounded-full">
                {" "}
                <img src="src/assets/user.png" width={40} height={40} />
              </div>
              <div className="flex flex-col items-start">
                <h3 className="text-md">{messages?.receiver?.fullName}</h3>
                <p className="text-sm font-light">Available</p>
              </div>
            </div>
           
          </div>
        )}
        <div className="h-[75%] border w-full overflow-scroll">
          <div className=" h-[1000px] px-10 py-14">
            {messages?.messages?.length > 0 ? (
              messages.messages.map(({ message, user: { id } = {} }) => {
                if (id === user?.id) {
                  return (
                    <>
                    <div
                      className="max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl text-white ml-auto p-4 mb-6 text-left "
                      style={{ overflowWrap: "break-word" }}
                    >
                      {message}
                    </div>
                    <div ref={messageRef}></div>

                    </>
                  );
                } else {
                  return (
                    <>
                    <div
                      className="max-w-[40%] bg-[#15aefa] rounded-b-xl rounded-tr-xl text-white p-4 mb-6 text-left "
                      style={{ overflowWrap: "break-word" }}
                    >
                      {message}
                    </div>
                    <div ref={messageRef}></div>
                    </>
                  );
                }
              })
              
              
            ) : (
              <div className="text-md font-black flex justify-center items-center">
                No new Conversation
              </div>
            )}
          </div>
        </div>
       <div className="flex">
          <div className="w-[85%] p-5">
            <Input
              className="rounded-full px-5 py-3"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div
            className={`w-[15%] p-7 cursor-pointer ${
              !message && "pointer-events-none"
            }`}
            onClick={() => sendMessage()}
          >
            <img
              src={send}
              width={50}
              className="  border border-primary p-[10px] rounded-3xl"
            />
          </div>
        </div>
      </div>
      <div className="w-[25%]">
        <div className="h-[30%] ">
        <div className="flex flex-col justify-center items-center mt-10 gap-5">
          <div className=" border border-primary p-[2px] rounded-full ">
            {" "}
            <img src="src/assets/user.png" width={150} />
          </div>
          <div className="text-white text-2xl ">{messages?.receiver?.fullName?messages?.receiver?.fullName:user?.fullName}</div>
          </div>
          </div>
          <div className=" bg-white overflow-scroll h-[500px]">
          {(users.map(({ user, userId }) => {
            
             return(
              
              <div className="bg-white flex flex-col justify-start">
            {  <div className="flex my-3 gap-5 cursor-pointer bg-white " onClick={()=>fetchMessages('new',user)}>
              <div className=" border border-primary p-[2px] rounded-full">
                <img src={Img} width={50} height={50} />
              </div>
              <div className="flex flex-col  items-start">
                <h3 className="text-lg">{user?.fullName}</h3>
                <p className="text-sm font-light">{user?.email}</p>
              </div>
            </div>}
            </div>
            )
          }))}
          </div>
          <hr />
        </div>
      </div>
    
  );
};

export default Dashboard;
