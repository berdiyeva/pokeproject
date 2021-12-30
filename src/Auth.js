import React from "react";
import {
    Redirect ,
    useLocation
  } from "react-router-dom";



export const setToken = (token) =>{

    // set token in localStorage
    localStorage.setItem('Token', token)

}

export const fetchToken = (token) =>{

    // fetch the token
    return localStorage.getItem('Token')

}




export function RequireToken({children}) {

    
    let auth = fetchToken()
    let location = useLocation();
  
    if (!auth) {
      
      return <Redirect to="/" state={{ from: location }} />;
    }
  
    return children;
}