import { Fragment, useState } from "react"
import { toast } from 'react-toastify';
import { login, createUser } from './../../Apis/Apis';
import { Link, useNavigate } from "react-router-dom";
import Header from "../Layouts/Header";

const Login = () => {
   const navigate=useNavigate();
   const email_reg="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
   const [pageNo,setPageNo]=useState(1);
   const [getRegisterData,setRegisterData]=useState({
      name:'',
      email:'',
      mobile:"",
      password:'',
      confirmPassword:'',
      address:""
   })
   const [getLoginDetails,setLoginDetails]=useState({
      email:'',
      password:''
   })
   const [Loader,setLoader]=useState(false)

   const handleLogin=async(e)=>{
      e.preventDefault();
      if(!getLoginDetails?.email || !getLoginDetails?.password){
         toast.error("Please provide email and password.")
         return;
      }else{
         setLoader(true)
         let data={
            email:getLoginDetails.email,
            password:getLoginDetails.password
         }
         let result = await login(data);
         setLoader(false)
         if(result?.status){
            toast.success(result?.message)
            localStorage.setItem("token",result?.token)
            localStorage.setItem("userData",JSON.stringify(result?.body))
            navigate('/')
         }else{
            toast.error(result?.message)
         }
      }
   }
   const [isError,setIsError]=useState(false);
   const handleSubmit=async(e)=>{
      e.preventDefault();
      if(!getRegisterData?.name || !getRegisterData?.email || !getRegisterData?.mobile || !getRegisterData?.password || !getRegisterData?.confirmPassword || !getRegisterData.email.match(email_reg) || !getRegisterData?.address || getRegisterData?.password!=getRegisterData?.confirmPassword){
         setIsError(true);
         return;
      }else{
         let user={
            name:getRegisterData.name,
            email:getRegisterData.email,
            mobile:getRegisterData.mobile,
            password:getRegisterData.password,
            confirmPassword:getRegisterData.confirmPassword,
            address:getRegisterData?.address
         }
         setLoader(true);
         let result=await createUser(user);
         setLoader(false);
         if(result?.status){
            toast.success(result?.message);
            let data={
               name:'',
               email:'',
               mobile:"",
               password:'',
               confirmPassword:'',
               address:""
            }
            setIsError(false);
            setRegisterData(data)
         }else{
            toast.error(result?.message);
         }
      }
   }
   return (
    <Fragment>
        <div className="registration-page">
            <div className="registration-page-inner container">
            <div className="wrapper">
               <div className="title-text">
                  <div className="title login">
                    {pageNo==1 ? 'Login Form' : 'Signup Form'} 
                  </div>
               </div>
               <div className="form-container">
                  <div className="slide-controls">
                     <input type="radio" name="slide" id="login" value="1" checked={pageNo==1} onChange={(e)=>setPageNo(e.target.value)}/>
                     <input type="radio" name="slide" id="signup" value="2" checked={pageNo==2} onChange={(e)=>setPageNo(e.target.value)}/>
                     <label htmlFor="login" className="slide login">Login</label>
                     <label htmlFor="signup" className="slide signup">Signup</label>
                     <div className="slider-tab"></div>
                  </div>
                  <div className="form-inner">
                    {pageNo==1? 
                     <form className="login">
                        <div className="field">
                           <input 
                             type="text" 
                             value={getLoginDetails.email}
                             onChange={(e)=>setLoginDetails({...getLoginDetails, email:e.target.value})}
                             placeholder="Email Address" 
                             />
                        </div>
                        <div className="field">
                           <input 
                            type="password" 
                            value={getLoginDetails.password}
                            onChange={(e)=>setLoginDetails({... getLoginDetails, password:e.target.value})}
                            placeholder="Password" 
                            />
                        </div>
                        <div className="pass-link">
                           <a href="#">Forgot password?
                           </a>
                        </div>
                        <div className="field btn">
                           <div className="btn-layer">
                           </div>
                           {/* <input type="submit" value="Login" onClick={(e)=>handleLogin(e)}/> */}
                           <div className="submit-btn">
                              <button type="button" className="btn" onClick={(e)=>handleLogin(e)} disabled={Loader}>Login
                              {Loader && <div className="spinner-border" role="status">                           
                                 <span className="sr-only">Loading...</span>
                               </div>}</button>
                           </div>
                        </div>
                        <div className="signup-link">
                           Not a member? <Link to="javascript:void(0)" onClick={()=>setPageNo(2)}>Signup now</Link>
                        </div>
                     </form>                      
                    : 
                    <form className="signup">
                        <div className="field">
                           <input 
                             type="text" 
                             value={getRegisterData.name}
                             onChange={(e)=>setRegisterData({... getRegisterData, name:e.target.value})}
                             placeholder="Full name" 
                             />
                             {(isError && !getRegisterData?.name) && 
                                 <span className="text-danger">Full name is required.</span>
                              }
                        </div>
                        <div className="field">
                           <input 
                             type="text" 
                             value={getRegisterData.email}
                             onChange={(e)=>setRegisterData({... getRegisterData, email:e.target.value})}
                             placeholder="Email address" 
                             />
                              {isError && (!getRegisterData?.email) ?
                                 <span className="text-danger">Email is required.</span>
                                 :isError && !getRegisterData.email.match(email_reg) && <span className="text-danger">Invalid email address.</span>
                              }
                        </div>
                        <div className="field">
                           <input 
                             type="text" 
                             value={getRegisterData.mobile}
                             onChange={(e)=>setRegisterData({... getRegisterData, mobile:e.target.value})}
                             placeholder="Mobile number" 
                             />
                           {(isError && !getRegisterData?.mobile) 
                              && <span className="text-danger">Mobile no. is required.</span>
                           }
                        </div>
                        <div className="field">
                           <input 
                             type="password" 
                             value={getRegisterData.password}
                             onChange={(e)=>setRegisterData({... getRegisterData, password:e.target.value})}
                             placeholder="Password" />
                             {(isError && !getRegisterData?.password) 
                                 && <span className="text-danger">Password is required.</span>
                              
                              }
                        </div>
                        <div className="field">
                           <input 
                             type="password" 
                             value={getRegisterData.confirmPassword}
                             onChange={(e)=>setRegisterData({... getRegisterData, confirmPassword:e.target.value})}
                             placeholder="Confirm password" />
                              {
                              isError && (!getRegisterData?.confirmPassword) ? 
                                 <span className="text-danger">Confirm password is required.</span>
                                 :
                                 (isError && getRegisterData?.confirmPassword!=getRegisterData?.password) &&  <span className="text-danger">Password and confirm password should be matched.</span>
                                 
                              }
                        </div>
                        <div className="field">
                           <input 
                             type="text" 
                             value={getRegisterData.address}
                             onChange={(e)=>setRegisterData({... getRegisterData, address:e.target.value})}
                             placeholder="Address" />
                              {
                              isError && (!getRegisterData?.address) &&
                                 <span className="text-danger">Address is required.</span>
                              }
                        </div>
                        <div className="field btn">
                           <div className="btn-layer"></div>
                           {/* <input type="submit" value="Signup" /> */}
                           <div className="submit-btn">
                              <button type="button" className="btn" onClick={(e)=>handleSubmit(e)} disabled={Loader}>Signup
                              {Loader && <div className="spinner-border" role="status">                           
                                 <span className="sr-only">Loading...</span>
                               </div>}</button>
                           </div>
                        </div>
                     </form>
                    } 
                     
                  </div>
               </div>
            </div>
            </div>
        </div>

    </Fragment>
  )
}

export default Login
