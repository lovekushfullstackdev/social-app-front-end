import React, { useEffect } from 'react'
import {isAuthenticated} from './Auth'
import { Navigate, useNavigate } from 'react-router-dom'

const Private = ({ children }) => {

const user = isAuthenticated();
if (!user) {
  // user is not authenticated
  return <Navigate to="/login" />;
}
return children
}

export default Private
