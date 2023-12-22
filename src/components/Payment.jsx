import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {loadStripe} from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
  CardElement
} from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51OMPOYSIa9B2WEB5O13s9Sel7AF7oMYf4lK5QxBMiuR6rejWuuLYzaNdpmr3zIiNOFRYC191HpbYKCvJZCFcilQ7002kqSb31R");

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const stripe = await loadStripe("pk_test_51OMPOYSIa9B2WEB5O13s9Sel7AF7oMYf4lK5QxBMiuR6rejWuuLYzaNdpmr3zIiNOFRYC191HpbYKCvJZCFcilQ7002kqSb31R");

        const { data } = await axios.post('http://192.168.5.205:8000/create-payment-intent', {
          amount:10,
          currency: 'usd',
          returnUrl: 'http://localhost:3000/', // Set the return_url
        });
  
        let result= stripe.redirectToCheckout({
            sessionId:data?.id
        })
        console.log("result",result);
        if(result?.error){
            console.log("error",result?.error);
        }else{
            console.log("success",result?.success);
        }
        // Handle the server response
        console.log(data);
    
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit">Pay</button>
      </form>
    );
  };



const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      );
}

export default Payment
