import React, { useEffect, useState } from 'react'
import { get_users_list } from './../Apis/Apis';
import profile from './../../src/assets/images/profile-pic-dummy.png';
import io from 'socket.io-client';
import no_svg from './../assets/images/head-features.svg'
const socket = io.connect('http://192.168.5.205:8000/');

function Chat() {
    const [userDetails,setUserDetails]=useState(null);
    const [usersList,setUsersList]=useState([]);
    const [messages_, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [roomId,setRoomId]=useState(null);
    const [receiverId,setReceiverId]=useState();

    useEffect(() => {
        let data=localStorage.getItem("userData")
        if(data){
            setUserDetails(JSON.parse(data));
        }
        socket.on('get_messages', (msgs) => {
            setMessages(msgs);
        });
    
        socket.on('receive_msg', (data) => {
            // Create a new array based on the current state    
            let updatedMessages = [...messages_];
            // Update the new array with the received message
            updatedMessages.push(data.message);
            // Set the state with the updated array
            setMessages(updatedMessages);
        });
    }, [socket, messages_]); 

    const sendMessage = (e) => {
        socket.emit("send_msg",{room_id:roomId,msg:inputMessage,user_id:userDetails.id,to_user_id:receiverId})
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
        e.target.src=profile;
    }
    const [activeIndex,setActiveIndex]=useState(null);

    const activeChat=(index,to_id)=>{
        setReceiverId(to_id)
        let room_id=to_id<userDetails.id ? to_id+""+userDetails.id : userDetails.id+""+to_id;
        if(room_id==roomId){
            return ;
        }else{
            setRoomId(room_id)
            socket.emit("join_room",{room_id:room_id,user_id:userDetails.id,to_user_id:to_id})
            setActiveIndex(index)
        }
        console.log("room id",room_id);
    }

  return (
    <div className='message-chat'>
        <div className="container chat-dual-sections">
            <div className="chat-container">
                <div className="main-heading">Chat</div>
                { roomId ? 
                <>
                    <div className="messages">
                        {/* <div className="message">Hello, how are you?</div>
                        <div className="message user-message">I'm doing great! How about you?</div>
                        <div className="message">Hello, how are you?</div>
                        <div className="message user-message">I'm doing great! How about you?</div> */}
                        {messages_.map((message,index)=>(
                            <div key={index} className={`message ${message.sender_id==userDetails.id ? 'user-message' : ''}`}>{message.content}</div>
                        ))}
                        {!messages_.length && "No messages"}
                    </div>
                    <div className="comment-box">
                        <input 
                        type="text" 
                        className="form-control comment-input" 
                        placeholder="Type your message..." 
                        value={inputMessage}
                        onChange={(e)=>setInputMessage(e.target.value)}
                        />
                        <button className="comment-button" onClick={(e)=>sendMessage(e)}><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                </>
                :
                <div className="no-msg-img-icon">
                    <img src={no_svg} className='no-msg' />
                </div>
                }


            </div>
            <div className="chat-container">
                <div className="main-heading">Chat With</div>
                <div className="messages">
                    {usersList.map((user,index)=>(
                        <div onClick={(e)=>activeChat(index,user.id)} className={`user-profile ${index==activeIndex?'active':''}`} key={user.id}>
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
