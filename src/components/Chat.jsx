import React, { useEffect, useState } from 'react'
import { get_users_list } from './../Apis/Apis';
import profile from './../../src/assets/images/profile-pic-dummy.png';
import io from 'socket.io-client';
const socket = io.connect('http://192.168.5.205:8000/');

function Chat() {

    const [usersList,setUsersList]=useState([]);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
  
    useEffect(() => {
        socket.on('send_message', (msg) => {
          setMessages([...messages, msg]);
          console.log("new_msg",msg);
        });
        
        socket.on('send_msg', (msg) => {
          setMessages([...messages, msg]);
          console.log("send_msg-->>",msg);
        });
    
        socket.emit("join_room",{room_id:localStorage.getItem("room_id")})
    
        // return () => {
        //   socket.disconnect();
        // };
    }, [socket]);

    const sendMessage = (e) => {
        socket.emit("receive_msg",{room_id:localStorage.getItem("room_id"),msg:inputMessage})
        setInputMessage('');
    };

    useEffect(()=>{
        getUsersList();
    },[])

    const getUsersList=async()=>{
        let result = await get_users_list();
        if(result.status){
            setUsersList(result.body)
        }else{

        }
    }

    const handleImageError=(e)=>{
        // console.log("imgonError")
        e.target.src=profile;
    }
    const [activeIndex,setActiveIndex]=useState(0);

    const activeChat=(index)=>{
        setActiveIndex(index)
    }

  return (
    <div className='message-chat'>
        <div className="container chat-dual-sections">
            <div class="chat-container">
                <div className="main-heading">Chat</div>
                <div class="messages">
                    <div class="message">Hello, how are you?</div>
                    <div class="message user-message">I'm doing great! How about you?</div>
                    <div class="message">Hello, how are you?</div>
                    <div class="message user-message">I'm doing great! How about you?</div>
                </div>
                <div className="comment-box">
                    <input 
                    type="text" 
                    className="form-control comment-input" 
                    placeholder="Type your message..." 
                    // value={newComment}
                    // onChange={(e)=>setNewComment(e.target.value)}
                    />
                    <button className="comment-button" onClick={(e)=>sendMessage(e)}><i className="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
            <div class="chat-container">
                <div className="main-heading">Chat With</div>
                <div class="messages">
                    {usersList.map((user,index)=>(
                        <div onClick={(e)=>activeChat(index)} className={`user-profile ${index==activeIndex?'active':''}`}>
                            <div className="user-profile-img">
                                <img 
                                    src={user.profile_pic} 
                                    // alt="User Profile Picture" 
                                    onError={handleImageError}
                                />
                            </div>
                            <div className="is-online"></div>
                            <span className="user-name">{user.name}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    </div>
  )
}

export default Chat
