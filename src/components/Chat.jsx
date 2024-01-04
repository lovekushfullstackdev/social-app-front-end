import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';

import { get_users_list,get_all_users,create_group,get_group_list } from './../Apis/Apis';
import profile from './../../src/assets/images/profile-pic-dummy.png';
import io from 'socket.io-client';
import no_svg from './../assets/images/head-features.svg'
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Multiselect from 'multiselect-react-dropdown';
import { toast } from 'react-toastify';
import group_dummy from './../../src/assets/images/dummy-group.jpg'

const socket = io.connect('http://192.168.5.205:8000/');

function Chat() {
    const [userDetails,setUserDetails]=useState(null);
    const [usersList,setUsersList]=useState([]);
    const [groupList,setGroupList]=useState([]);
    const [messages_, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [roomId,setRoomId]=useState(null);
    const [receiverId,setReceiverId]=useState();
    const [isEmoji,setIsEmoji]=useState(false);
    const messagesRef = useRef(null);
    const [isModal,setIsModal]=useState(false)
    const [addGroup,setGroup]=useState({
        title:"",
        users_id:""
    })
    const [groupUsers,setGroupUsers]=useState([]);
    const [loader,setLoader]=useState();
    const [activeChatBox,setActiveChatBox]=useState(1)

    useEffect(() => {
        let data=localStorage.getItem("userData")
        if(data){
            setUserDetails(JSON.parse(data));
        }
        socket.on('get_messages', (msgs) => {
            setMessages(msgs);
        });
        socket.on('receive_msg', (data) => {
            console.log("data",data);
            if(roomId==data.room_id){
            // Create a new array based on the current state

            let updatedMessages = [...messages_];
            // Update the new array with the received message
            for(let msg of data.message){
                updatedMessages.push(msg);
            }    
            // Set the state with the updated array
            setMessages(updatedMessages);
            }else{
                getUsersList();
            }

        });

        return () => {
            socket.off('get_messages');
            socket.off('receive_msg');
        };

    }, [socket, messages_]); 

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages_]);

    const sendMessage = (e) => {
        e.preventDefault();
        
        /**********User should be at top whome u sent msg*********/
        if(activeIndex!=0){
            let users=[...usersList];
            let activeUser=users[activeIndex];
            users.splice(activeIndex,1);
            users.unshift(activeUser)
            setUsersList(users)
            setActiveIndex(0);
        }

        if(selectedImage){
            socket.emit("send_msg",{room_id:roomId,msg:inputMessage,isFile:true,file:selectedImage,user_id:userDetails.id,to_user_id:receiverId})
        }else{
            socket.emit("send_msg",{room_id:roomId,msg:inputMessage,isFile:false,user_id:userDetails.id,to_user_id:receiverId})
        }
        setSelectedImage("")
        setInputMessage('');
        setIsEmoji(false)
    };

    useEffect(()=>{
        getUsersList();
        getAllUsers();
        getGroupList();
    },[])

    const getAllUsers=async()=>{
        let result = await get_all_users();
        if(result.status){
            setGroupUsers(result.body)
        }else{

        }
    }

    const getUsersList=async()=>{
        let result = await get_users_list();
        if(result.status){
            setUsersList(result.body)
        }else{

        }
    }

    const getGroupList=async()=>{
        let result= await get_group_list();
        if(result.status){
            setGroupList(result.body)
        }
    }

    const handleImageError=(e)=>{
        e.target.src=profile;
    }
    const [activeIndex,setActiveIndex]=useState(null);

    const activeChat=(index,to_id,isGroup)=>{
        setReceiverId(to_id)

        let room_id="";
        if(!isGroup){
            room_id=to_id<userDetails.id ? to_id+""+userDetails.id : userDetails.id+""+to_id;
        }else{
            room_id=to_id; // Room id 
        } 
        if(room_id==roomId){
            return ;
        }else{
            if(roomId){
                socket.emit('leave_room',roomId);
            }
            setRoomId(room_id)
            socket.emit("join_room",{room_id:room_id,user_id:userDetails.id,to_user_id:to_id})
            setActiveIndex(index)
        }
    }
    const onEmojiClick = (event) => {
        setInputMessage((prevInputMessage) => {
            return prevInputMessage+""+event.emoji; // Return the same value to maintain the current state
        });
    };
    const openEmojis=(e)=>{
        setIsEmoji(!isEmoji)
    };

   const setMsgValue=(e)=>{
        setInputMessage(e.target.value)
    }
    const [selectedImage,setSelectedImage]=useState(null);
   const handelImage=(e)=>{
    let files=e.target.files;
    if(files.length){
        let file=files[0];
        const reader=new FileReader();
        reader.onload=()=>{
            setSelectedImage(reader.result)
        }
        reader.readAsDataURL(file);
    }
   }
   const clearImage=()=>{
    setSelectedImage('');
   }

   const openModal=()=>{
      setIsModal(true)
   }
   const closeModal=()=>{
      setIsModal(false)
   }
   const onSelectUser=(e)=>{
    setGroup({...addGroup,users_id:e})
   }
   const createGroup=async()=>{
    if(!addGroup.title){
        toast.error("Please fill each field.")
        return;
    }else{
        let ids=addGroup.users_id ?addGroup.users_id.map(item=>item.id).join(','):"";
        let data={
            title:addGroup.title,
            ids:ids
        }
        setLoader(true)
        let result = await create_group(data);
        setLoader(false)
        if(result.status){
            toast.success(result.message)
            getGroupList();
            closeModal();
        }else{
            toast.error(result.message)
        }
    }
   }

   const openChatActiveBox=(x)=>{
    setActiveChatBox(x);
    setActiveIndex(-1);
    setRoomId(0);
   }
  return (
    <div className='message-chat'>
        <div className="container chat-dual-sections">
            <div className="chat-container">
                <div className="main-heading">Chat</div>
                { roomId ? 
                <>
                    <div className="messages" id="new-mgs" ref={messagesRef}>
                        {messages_.map((message,index)=>(
                            <div key={index} className={`message ${message.sender_id==userDetails.id ? 'user-message right-side' : 'left-side'}`}>
                                
                                {message.file ? 
                                    <div className={`recived-img ${message.sender_id==userDetails.id ? 'right-side' : 'left-side'}`} >
                                        <img src={message.file} alt="Selected" />
                                    </div>
                                :
                                message.content
                                }
                            </div>
                        ))}
                        {!messages_.length && "No messages"}
                    </div>
                    <form className='send-msg-form'>
                        {selectedImage && (
                            <div className="image-preview">
                                <button type="button" className='remove-image' onClick={clearImage}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                                <div className="select-image">
                                    <img src={selectedImage} alt="Selected" />
                                </div>
                            </div>
                        )}
                        <div className="comment-box">
                            <input 
                                type="text" 
                                className="form-control comment-input" 
                                placeholder="Type your message..." 
                                value={inputMessage}
                                onChange={(e)=>setMsgValue(e)}
                            />
                            <button type='submit' className="comment-button" onClick={(e)=>sendMessage(e)} disabled={!inputMessage.length && (selectedImage ? false : true)}><i className="fa-solid fa-paper-plane"></i></button>
                            <button type='button' className="comment-button" onClick={openEmojis}><i className="fa-solid fa-face-smile"></i></button>
                            <input type="file" style={{"display":"none"}} id="file-attachment" onChange={handelImage}/>
                            <label htmlFor='file-attachment' className="comment-button">
                                    <i className="fa-solid fa-paperclip"></i>
                            </label>
                        </div>
                    </form>
                    {isEmoji && <div className='send-emojis'>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>}
                </>
                :
                <div className="no-msg-img-icon">
                    <img src={no_svg} className='no-msg' />
                </div>
                }


            </div>
            <div className="chat-container">
                <div className="main-heading">Chat With</div>
                <div className='create-group'><Link to="javascript:void(0)" onClick={openModal}>Create group</Link></div>
                <div className="chat-container-inner">
                    <div className="dual-chat-with">
                        <button className={`btn cht-user ${activeChatBox== 1 ?"active":""}`} onClick={()=>openChatActiveBox(1)} >Users</button>
                        <button className={`btn cht-group ${activeChatBox== 2 ?"active":""}`} onClick={()=>openChatActiveBox(2)}>Groups</button>
                    </div>
                    {activeChatBox ==1 ? <div className="messages">
                        {usersList.map((user,index)=>(
                            <div onClick={(e)=>activeChat(index,user.id,false)} className={`user-profile ${index==activeIndex?'active':''}`} key={user.id}>
                                <div className="user-profile-img">
                                    <img 
                                        src={user.profile_pic} 
                                        // alt="User Profile Picture" 
                                        onError={handleImageError}
                                    />
                                </div>
                                <div className="is-online" style={{backgroundColor:`${user?.is_logged_in ? 'limegreen':'#fb3a26'}`}}></div>
                                <span className="user-name">{user.name}</span>
                            </div>
                        ))}
                    </div>:<div className="messages">
                        {groupList.map((group,index)=>(
                            <div onClick={(e)=>activeChat(index,group.room_id,true)} className={`user-profile ${index==activeIndex?'active':''}`} key={group.id}>
                                <div className="user-profile-img">
                                    <img 
                                        src={group_dummy} 
                                        // alt="User Profile Picture" 
                                        onError={handleImageError}
                                    />
                                </div>
                                <span className="user-name">{group.group_name}</span>
                            </div>
                        ))}
                        { !groupList.length && "No groups found!" }
                    </div>}
                </div>

            </div>

            <Modal show={isModal} animation={true} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="create-group-modal">
                    <div className="col-md-12 mt-2">
                        <label htmlFor="group-title" className="form-label">Group Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="group-title" 
                            placeholder="Group Title"
                            value={addGroup?.title}
                            onChange={(e)=>setGroup({...addGroup,title:e.target.value})}
                        />
                    </div>
                    <div className="col-md-12 mt-3">
                        <label htmlFor="AddUsers" className="form-label">Add Users (Optional)</label>
                        <Multiselect
                            options={groupUsers} // Options to display in the dropdown
                            // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                            onSelect={(e)=>onSelectUser(e)} // Function will trigger on select event
                            // onRemove={} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                        />

                    </div>
                    <div className="dual-btns">
                        <button className='cancel-button' variant="secondary" onClick={closeModal}>
                            Cancel
                        </button>
                        <button className='btn btn-primary' variant="primary" onClick={createGroup} disabled={loader}>
                            Create 
                            {loader && <div className="spinner-border" role="status">                           
                               <span className="sr-only">Loading...</span>
                            </div>}
                        </button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </div>
    </div>
  )
}

export default Chat
