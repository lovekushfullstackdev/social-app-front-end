import {Fragment, useEffect, useState} from 'react'
import { toast } from 'react-toastify'
import { updateProfile } from './../../Apis/Apis';

const Profile = () => {
    const [profile,setProfile]=useState({
        name:"",
        email:"",
        address:"",
        mobile:"",
        profile_pic:""
    })
  const [Loader,setLoader]=useState(false);
  useEffect(()=>{
    let data=localStorage.getItem("userData")
    if(data){
        let data2=JSON.parse(data);
        setProfile({...profile,name:data2.name,email:data2.email,mobile:data2.mobile,address:data2.address,profile_pic:data2.profile_pic})
    }
  },[])

  const handleSubmit=async()=>{
    if(!profile.name || !profile.email || !profile.mobile || !profile.address){
        toast.error("Please provide data in each field.")
        return;
    }else{
        setLoader(true);
        let result = await updateProfile(profile);
        console.log("result",result);
        setLoader(false);
        if(result.status){
            toast.success(result?.message)
            let data=localStorage.getItem("userData");
            if(data){
                let updated_profile=result.body;
                let data2=JSON.parse(data);
                data2.name=updated_profile.name;
                data2.mobile=updated_profile.mobile;
                data2.address=updated_profile.address;
                data2.profile_pic=updated_profile.profile_pic || data2.profile_pic;
                localStorage.setItem("userData",JSON.stringify(data2));
            }
        }else{
            toast.error(result?.message);
        }
    }
  }

  const loadFile = function (event) {
    const image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);
    setProfile({...profile,profile_pic:event.target.files[0]})
  };
    
  return (
    <Fragment>
      <div className="right-nav my-profile">
      <div className="container">
        <div className="main-heading">Update Profile</div>

        <div className="profile-form">
            <form className="row g-3">
                <div className="col-md-12">
                <div class="profile-pic">
                    <label class="-label" for="file">
                        <span class="glyphicon glyphicon-camera"></span>
                        <span>Change Image</span>
                    </label>
                    <input id="file" type="file" onChange={(e)=>loadFile(e)}/>
                    <img src={profile?.profile_pic} id="output" width="200" />
                </div>

                </div>
                <div className="col-md-3">
                    <label htmlFor="inputEmail4" className="form-label" disabled>Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="inputEmail4" 
                      placeholder="Email"
                      value={profile?.email}
                      disabled
                      />
                </div>
                <div className="col-md-3">
                    <label htmlFor="fullname" className="form-label">Full Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="fullname" 
                        placeholder="Full name"
                        value={profile?.name}
                        onChange={(e)=>setProfile({... profile,name:e.target.value})}
                        />
                </div>
                <div className="col-3">
                    <label htmlFor="inputAddress" className="form-label">Address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="inputAddress" 
                        placeholder="1234 Main St" 
                        value={profile?.address}
                        onChange={(e)=>setProfile({... profile,address:e.target.value})}
                        />
                </div>
                <div className="col-md-3">
                    <label htmlFor="mobile" className="form-label">Mobile</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="mobile" 
                        placeholder="+919876543210" 
                        value={profile?.mobile}
                        onChange={(e)=>setProfile({... profile,mobile:e.target.value})}
                        />
                </div>
                <div className="col-md-12">
                    <div className="col-md-3 my-4">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={Loader}>Update
                        {Loader && <div className="spinner-border" role="status">                           
                            <span className="sr-only">Loading...</span>
                        </div>}
                        </button>
                    </div>
                </div>
            </form>
        </div>

        </div>
      </div>
    </Fragment>
  )
}

export default Profile
