import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import companyLogo from './../../assets/images/chat-app-logo-icon-vector.jpg'
import { Chat, Person, Search, Notifications } from '@material-ui/icons'
import { logout } from '../../Auth/Auth'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';


const Header = () => {
    const navigate=useNavigate();
    const [isLogout,setIsLogout]=useState(false)
    
    const openLogoutModal=()=>{
        setIsLogout(true);
    }
    const closeModal=()=>{
        setIsLogout(false);
    }
    const logout_=()=>{
        logout();
        navigate("/login")
    }

    const [data,setData]=useState();

    useEffect(()=>{
        let data=localStorage.getItem("userData")
        if(data){
            let data2=JSON.parse(data);
            setData(data2)
        }
    },[])

  return (
  <>
  {/* <div className="header">
    <img src={companyLogo} style={{ height: "60px", width: "80px", borderRadius: "10px" }}/>
      <div className="header-right">
          <Link className="active" to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/logout">Logout</Link>
      </div>
  </div> */}

    <div className='topbarContainer'>
        <div className="topbarLeft">
            <span className="logo"> <img src={companyLogo} style={{ height: "60px", width: "80px", borderRadius: "10px" }}/></span>
        </div>
        <div className="topbarCenter">
            <div className="searchbar">
              <Search className='serachIcon' />
              <input placeholder='search for friend, post or videos' className="searchInput" />
            </div>
        </div>
        <div className="topbarRight">
            <div className="topbarLinks">
              <Link to="/" className='linkColor'>  <span className="topbarLinks">Homepage</span></Link>
              <span className="topbarLinks">Timeline</span>
            </div>
          
            <div className="topbarIcons">
                <div className="topbarIconItem">
                <Person/>
                <span className="topbarIconBadge">1</span>
                </div>
                <Link to="/message-chat" >  <div className="topbarIconItem">
                <Chat/>
              <span className="topbarIconBadge">2</span>
                </div></Link> 
                <div className="topbarIconItem">
                <Notifications/>
                <span className="topbarIconBadge">3</span>
                </div>
            </div>
            <img src={data && data.profile_pic} alt="" className="topbarImg" />
            <ul className="navbar-nav">
              <li className="nav-item dropdown " >
                <Link className="nav-link dropdown-toggle element.style " href="#" id="navbarDarkDropdownMenuLink" role="button" data-toggle="dropdown" aria-expanded="false">
                {data && data.name}
                </Link>
                <ul className="dropdown-menu dropdown-menu-dark profile-pop" aria-labelledby="navbarDarkDropdownMenuLink">
                  <li><Link className="dropdown-item" to="">View profile</Link></li>
                  
                  <li><Link className="dropdown-item" to="/my-profile">Edit Profile</Link> </li>
                  <li onClick={openLogoutModal}><Link className="dropdown-item">Logout</Link></li>
                </ul>
              </li>
            </ul>
        </div>
        
        <Modal show={isLogout} animation={true}>
            <Modal.Header>
                <Modal.Title>Logout Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Do you really want to Logout?</h5>
                <div className="dual-btns">
                  <button className='cancel-button' variant="secondary" onClick={closeModal}>
                    No
                  </button>
                  <button className='btn btn-primary' variant="primary" onClick={logout_}>
                    Yes
                  </button>
                </div>  
            </Modal.Body>
        </Modal>
    </div>
</>
  )
}

export default Header
