export const isAuthenticated=()=>{
    let token=localStorage.getItem("token")
    if(token){
        return true;
    }else{
        return false;
    }
}

export const logout=()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
}