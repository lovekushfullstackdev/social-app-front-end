import axios from 'axios';
import {api_base} from './../Matcher'

/************Login new user**********/
export const login=async(data)=>{
    try{
        let response=await fetch(`${api_base}/userLogin`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        let responseData = await response.json();
        return responseData;        
    }catch(error){
        console.log("error",error);
    }
}

/************Register new user**********/
export const createUser=async(user)=>{
    try{
        let response= await fetch(`${api_base}/createUser`,{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(user)
        })
        let responseData=await response.json();
        return responseData;
    }catch(error){
        return error;
    }
}

/************Update profile*********/
export const updateProfile=async(data)=>{
    try{

        const form = new FormData();
        form.append('name', data.name);
        form.append('email', data.email);
        // form.append('mobile', formData.mobile);
        form.append('mobile', data.mobile);
        form.append('profile_pic', data.profile_pic);
        form.append('address', data.address);
        let response =await axios.post(api_base + "/updateProfile", form,
        {
            headers: {
              "Content-Type": "multipart/form-data",
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          }
        )
        let responseData=await response.data;
        return responseData;
    }catch(error){

    }
}

/************Get all the posts**********/
export const get_all_posts=async()=>{
    try{
        let token=localStorage.getItem("token");
        let response=await fetch(`${api_base}/get_all_posts`,{
            method:"GET",
            headers:{'Content-Type':'application/json',Authorization: `Bearer ${token}`},
        })
        let responseData=await response.json();
        return responseData;
    }catch(error){
        console.log(error);
    }
}

/************Upload post**********/
export const upload_post=async(new_post)=>{
    try{
        const form = new FormData();
        form.append('description', new_post.description);
        form.append('post_img', new_post.post_img);

        let response =await axios.post(api_base + "/upload_post", form,
            {
                headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            }
        )
        let responseData=await response.data;
        return responseData;
    }catch(error){
        console.log("error",error);
    }
}

/************Like a post**********/
export const post_like=async(post_id)=>{
    try{
        let token=localStorage.getItem("token");
        let data={
            post_id:post_id
        }
        let response=await fetch(`${api_base}/post-like`,{
            method:"POST",
            headers:{'Content-Type':'application/json',Authorization: `Bearer ${token}`},
            body:JSON.stringify(data)
        })
        let responseData=await response.json();
        return responseData;
    }catch(error){
        console.log("error",error);
    }
}

/************Add comment for post**********/
export const post_comment=async(post_id,new_comment)=>{
    try{
        let token=localStorage.getItem("token")
        let data={
            post_id:post_id,
            comment:new_comment
        }
        let response=await fetch(api_base+'/post-comment',{
            method:"POST",
            headers:{'Content-Type':'application/json',Authorization: `Bearer ${token}`},
            body:JSON.stringify(data)
        })
        let responseData=await response.json();
        return responseData;
    }catch(error){

    }
}

/************Fetch post comments**********/
export const get_post_comments=async(post_id)=>{
    try{
        let token=localStorage.getItem("token")
        let response=await fetch(`${api_base}/get-post-comments/${post_id}`,{
            method:"GET",
            headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        })
        let responseData=await response.json();
        return responseData;
    }catch(error){

    }
}

/************Delete post's comment**********/
export const delete_post_comments=async(comment_id)=>{
    try{
        let token=localStorage.getItem("token")
        let response=await fetch(`${api_base}/delete-post-comments/${comment_id}`,{
            method:"DELETE",
            headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        })
        let responseData=await response.json();
        return responseData;
    }catch(error){

    }
}

/**********get users list********/
export const get_users_list=async()=>{
    try{
        let token=localStorage.getItem("token")
        let response=await fetch(api_base+"/getUsersList",{
            method:"GET",
            headers:{'Content-Type':'application/json',Authorization:`Beared ${token}`}
        })
        let responseData=await  response.json();
        return responseData;
    }catch(error){

    }
}