import React, {useState,useEffect} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Payment from './components/Payment';
import Success from './components/Success';
import Cancel from './components/Cancel';
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import Login from './components/Authorization/Login';
import Layout from './components/Layouts/Layout';
import Private from './Auth/Private';
import Profile from './components/Profile/Profile';
import ImageCropper from './components/ImageCropper';
import Chat from './components/Chat';
import Parent from './components/Practice/Parent';


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
      <Route path="login" element={<Login />} />
      <Route path="parent" element={<Parent />} />
      <Route path="crop-img" element={<ImageCropper />} />
        <Route element={<Layout />}>
          <Route index element={<Private><Home /></Private>} />
          <Route path="payment" element={<Private><Payment /></Private>} />
          <Route path="success" element={<Private><Success /></Private>} />
          <Route path="cancel" element={<Private><Cancel /></Private>} />
          <Route path="my-profile" element={<Private><Profile /></Private>} />
          <Route path="message-chat" element={<Private><Chat /></Private>} />
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer theme="dark" autoClose="1200" transition={Zoom} />
    </>
  );
}

export default App;