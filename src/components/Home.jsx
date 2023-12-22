import React, { useEffect, useState, useRef} from 'react'
import Cropper from 'react-cropper';
import Header from './Layouts/Header'
import Footer from './Layouts/Footer'
import { get_all_posts,upload_post,post_like,post_comment,get_post_comments,delete_post_comments } from './../Apis/Apis'
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'cropperjs/dist/cropper.css';
import { toast } from 'react-toastify';
import Heart from "react-animated-heart";

const Home = () => {
  const [posts,setPosts]=useState([]);
  const [userData,setUserData]=useState();
  const [isPostModal,setPostModal]=useState(false);
  const [Loader,setLoader]=useState(false);
  const [commentIndex,setCommentIndex]=useState(null);
  const [newComment,setNewComment]=useState("")
  const [commentsList,setCommentsList]=useState([]);
  const [deleteModal,setDeleteModal]=useState(false);
  const [newPost,setNewPost]=useState({
    title:"",
    description:"",
    post_img:""
  })
  const [dltComment,setDltComment]=useState({
    comment_id:"",
    index:null,
    post_index:null
  })


  useEffect(()=>{
    getAllPosts();
    let data=localStorage.getItem("userData")
    if(data){
        let data2=JSON.parse(data);
        setUserData(data2)
    }
  },[])
  const getAllPosts=async()=>{
    let result= await get_all_posts();
    if(result?.status){
        setPosts(result.data);
    }
  }


  const getUploadedTime = (uploadedDate) => { 
    // console.log("uploadedDate",uploadedDate);
    let uploaded_date = new Date(uploadedDate)
    let current_date = new Date();
    // console.log("uploaded_date1",current_date.getHours(),current_date.getMinutes(),current_date.getSeconds());
    // console.log("uploaded_date2",uploaded_date.getHours(),uploaded_date.getMinutes(),uploaded_date.getSeconds());
    if (current_date.getFullYear() == uploaded_date.getFullYear()) {
      if (current_date.getMonth() == uploaded_date.getMonth()) {
        if (current_date.getDate() == uploaded_date.getDate()) {
          if (current_date.getHours() == uploaded_date.getHours()) {
            if (current_date.getMinutes() == uploaded_date.getMinutes()) {
              return "Just Now";
            } else {
              return current_date.getMinutes() - uploaded_date.getMinutes() + " mintue(s) ago";
            }
          } else {
            return current_date.getHours() - uploaded_date.getHours() + " Hour(s) ago";
          }
        } else {
          return current_date.getDate() - uploaded_date.getDate() + " Day(s) ago ";
        }
      } else {
        return current_date.getMonth() - uploaded_date.getMonth() + " Month(s) ago";
      }
    } else {
      // console.log("NOT equal");
      return current_date.getFullYear() - uploaded_date.getFullYear() + " Year(s) ago";
    }
  }

  const closeModal=()=>{
    setPostModal(false);
    setDeleteModal(false);
  }

/********Image crop******/
const [image, setImage] = useState("");
const [cropData, setCropData] = useState("");
const cropperRef = useRef(null);
const onChange = (e) => {
  e.preventDefault();
  let files=[];
  if (e.dataTransfer) {
    files = e.dataTransfer.files;
  } else if (e.target) {
    files = e.target.files;
  }
  
  const reader = new FileReader();
  reader.onload = () => {
    setImage(reader.result);
  };
  if(files.length){
    reader.readAsDataURL(files[0]);
    console.log("files[0]",files[0]);
  }
//   setNewPost({...newPost, post_img:files[0]})

};

const getCropData = () => {
  if (typeof cropperRef.current?.cropper !== "undefined") {
    const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();

    // Convert the cropped canvas to a Blob
    croppedCanvas.toBlob((blob) => {
      // Use a unique file name for your use case
      const fileName = "cropped_image.png";

      // Create a File object from the Blob with 'application/octet-stream' MIME type
      const croppedFile = new File([blob], fileName, { type: 'application/octet-stream' });

      // Now you can use 'croppedFile' for your desired purpose
      console.log(croppedFile);
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      setNewPost({...newPost, post_img:croppedFile})
    }, 'image/png'); // Specify the desired MIME type, e.g., 'image/png'


  }
};

/************/

const uploadPost=async()=>{
    if(!newPost.description || !newPost.post_img){
        toast.error("Provide data for each field.")
        return;
    }else{
        setLoader(true)
        console.log("newPost",newPost);
        let result = await upload_post(newPost);
        setLoader(false);
        if(result?.status){
            toast.success(result.message);
            setPostModal(false);
            getAllPosts();
            setNewPost({
                title:"",
                description:"",
                post_img:""
            })
            setImage("");
        }else{
            toast.error(result?.message)
        }
    }
}
const postLike=async(post_id,index)=>{
    let posts_=[...posts];
    posts_[index].is_like=!posts[index].is_like;
    if(posts_[index].is_like){
        posts_[index].total_likes=posts[index].total_likes+1;
    }else{
        posts_[index].total_likes=posts[index].total_likes-1;
    }
    setPosts(posts_)
    if(post_id){
        let result = await post_like(post_id);
    }
}
const onDoubleClick=(e,post_id,index)=>{
    if(e.detail==2){
        postLike(post_id,index);
    }
}
const openComment=async(index,post_id)=>{
  setCommentsList([]);
  setCommentIndex(index)
  let result = await get_post_comments(post_id);
  if(result.status){
    setCommentsList(result.body);
  }else{
    setCommentsList([]);
  }
}

const postComment=async(post_id,index)=>{
  if(!newComment){
    toast.error("Comment is required")
  }else{
    let result = await post_comment(post_id,newComment);
    if(result.status){
      toast.success(result.message)
      openComment(commentIndex,post_id)
      setNewComment("")
      let updatedPosts= [...posts]
      updatedPosts[index].total_comments+=1
      setPosts(updatedPosts)
    }else{
      toast.error(result.message)
    }
  }
}

const opendltModal=(comment_id,index,post_index)=>{
  setDeleteModal(true)
  setDltComment({... dltComment,comment_id:comment_id,index:index,post_index:post_index})
}

const deletePostComment=async()=>{
  let result =await delete_post_comments(dltComment.comment_id)
  if(result.status){
    toast.success(result.message)
    closeModal();
    let updatedComments=[...commentsList];
    updatedComments.splice(dltComment.index,1)
    setCommentsList(updatedComments)
    let updatedPosts= [...posts]
    updatedPosts[dltComment.post_index].total_comments-=1
    setPosts(updatedPosts)
  }else{
    toast.error(result.message)
  }
}


  return (
    <div className='home-page'>
        <div className="container">
            {/* <div className="main-heading"></div> */}
            <div className="upload-post">
                {userData && <div className="post-container">
                    <div className="user-profile">
                        <img src={userData.profile_pic} alt="User Profile Picture" />
                        <span className="user-name">{userData?.name}</span>
                    </div>
                    <div className="new-post-form">
                        <textarea
                          placeholder={`What's on your mind, ${userData?.name}?`} 
                          onClick={()=>setPostModal(true)}
                          className="form-control" 
                          id="exampleFormControlTextarea1" 
                          rows="3"
                        ></textarea>
                        {/* <input type="file" accept="image/*" id="image-upload" />
                        <label htmlFor="image-upload" className="image-upload-label">Add Photo/Video</label>
                        <button className="post-button">Post</button> */}
                    </div>
                </div>}
            </div>
            <div className="all-posts">
                {posts && posts.map((post,index)=>(
                    <div className="post-container" key={index}>
                        <div className="user-profile">
                            <img src={post.profile_pic} alt="User Profile Picture" />
                            <span className="user-name">{post.name}</span>
                            <span className="user-name-2">{getUploadedTime(post.uploaded_at)}</span>
                        </div>
                        <div className="post-content">
                            <span className="user-name">{post.title}</span>
                            <p>{post.description}</p>
                            <img src={post.post_img} alt="Shared Image" onClick={(e)=>onDoubleClick(e,post.p_id,index)}/>
                        </div>
                        {/* <hr /> */}
                        <div className="post-counts">
                            <span className='no-likes'>
                                <i className={`fa-solid fa-heart`}></i>{''+post.total_likes}
                            </span>
                            <span className='no-comments'>
                                {post.total_comments} comments
                            </span>
                        </div>
                        <div className="post-actions">
                            <button className="like-button" onClick={(e)=>postLike(post.p_id,index)}>
                                {/* <i className={`fa-${post.is_like==1 || post.is_like==true?'solid':'regular'} fa-heart`}></i>  */}
                                <Heart isClick={post.is_like} >Like</Heart>
                            </button>
                            <button className="comment-button" onClick={(e)=>openComment(index,post.p_id)}><i className="fa-regular fa-comment"></i> Comment</button>
                            <button className="share-button"><i className="fa-solid fa-share-from-square"></i> Share</button>
                        </div>
                        {/* <div className="post-actions">
                            <button className="comment-button"><i className="fa-regular fa-comment"></i> Comment</button>
                            <button className="share-button"><i className="fa-solid fa-share-from-square"></i> Share</button>
                        </div> */}
                      {index==commentIndex && <div className="post-comments">
                        <div className="comments-container">
                            {commentsList.map((comment,ind)=>(
                              <div className="comment">
                                <div className="comment-user">
                                  <div className="dual-action">
                                    <div className="user-profile-pick">
                                      <img src={comment.profile_pic} alt="User Profile Picture" className='user-profile-pic'/>
                                    </div>
                                    <span className="user-name">
                                    {comment.name}
                                    </span>
                                  </div>
                                  {userData && userData.id==comment.commented_user_id && <span className="dlt-comment" onClick={(e)=>opendltModal(comment.comment_id,ind,index)}>
                                   <i className="fa-solid fa-trash"></i> 
                                  </span>}
                                </div>
                                <div className="comment-text">{comment.comment}</div>
                                <div className="comment-actions">
                                  <span>Like</span>
                                  <span>Reply</span>
                                  <span>{getUploadedTime(comment.commented_at)}</span>
                                </div>
                            </div>
                            ))}
                        </div> 
                        <div className="comment-box">
                              <input 
                                type="text" 
                                className="form-control comment-input" 
                                placeholder="Write a comment..." 
                                value={newComment}
                                onChange={(e)=>setNewComment(e.target.value)}
                              />
                              <button className="comment-button" onClick={(e)=>postComment(post.p_id,index)}><i className="fa-solid fa-paper-plane"></i></button>
                        </div>
                      </div>}

                    </div>
                ))}
            </div>
        </div>

        <Modal show={isPostModal} animation={true} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Create Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="upload-post upload-modal">
                    {userData && <div className="post-container">
                        <div className="user-profile">
                            <img src={userData.profile_pic} alt="User Profile Picture" />
                            <span className="user-name">{userData?.name}</span>
                        </div>
                        <div className="new-post-form">
                            <textarea 
                                placeholder={`What's on your mind, ${userData?.name}?`}
                                value={newPost.description} 
                                onChange={(e)=>setNewPost({... newPost, description:e.target.value})} 
                                className="form-control" 
                                id="exampleFormControlTextarea1" 
                                rows="3"
                            ></textarea>
                            <input type="file" accept="image/*" id="image-upload" onChange={onChange} />
                            <label htmlFor="image-upload" className="image-upload-label">Add Photo/Video</label>
                        </div>
                    {image && <>
                        <Cropper
                            ref={cropperRef}
                            style={{ height: 200, width: "100%" }}
                            zoomTo={0.5}
                            initialAspectRatio={1}
                            preview=".img-preview"
                            src={image}
                            viewMode={1}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                            guides={true}
                        />
                        <div>
                            <div className="box" style={{ width: "50%", float: "right" }}>
                              <h3>Preview</h3>
                              <div
                                  className="img-preview"
                                  style={{ width: "100%", float: "left", height: "300px" }}
                              />
                            </div>
                            <div
                            className="box"
                            style={{ width: "50%", float: "right", height: "300px" }}
                            >
                            <h3>
                                <span>Crop</span>
                                <button style={{ float: "right", width:"200px" }} className='btn btn-primary' onClick={getCropData}>
                                Crop Image
                                </button>
                            </h3>
                            {cropData && <img style={{ width: "200px" }} src={cropData} alt="cropped" />}
                            </div>
                        </div>
                    </>
                    }
                     <button className="post-button" onClick={uploadPost} disabled={Loader}>
                        Post{Loader && <div className="spinner-border" role="status">                           
                                 <span className="sr-only">Loading...</span>
                               </div>}
                     </button>
                    </div>}
                </div>
            </Modal.Body>
        </Modal>

        <Modal show={deleteModal} animation={true} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Do you really want to delete this comment?</h5>
                <div className="dual-btns">
                  <button className='cancel-button' variant="secondary" onClick={closeModal}>
                    No
                  </button>
                  <button className='btn btn-primary' variant="primary" onClick={deletePostComment}>
                    Yes
                  </button>
                </div>
                
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default Home
