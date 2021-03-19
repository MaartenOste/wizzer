import React, { createContext, useContext, useState } from 'react';
import { apiConfig } from '../config';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser]= useState();
  //const BASE_URL = `${apiConfig.baseURL}`;

  /*function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return false;
  }*/

  const signIn = async (uname, password) => {
    /*const url = `/api/auth/login`;

    const body = {
      "email": email,
      "password": password
    };

    const myHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    const options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow',
      //credentials: 'include'
    };

    const response = await fetch(`${url}`, options);
    setCurrentUser(email);*/
    let response;

    if (uname === 'senne' && password === 'azer') {
      response = {id: '2051aze0r419azr1505a1zera05451041105160e', name: 'Senne Wancour', type: 'student'};
      setCurrentUser(response);
    } else if(uname === 'maarten' && password === 'azer'){
      response = {id: '05451041105162051505a1zera01aze0r419azre', name: 'Maarten Oste', type: 'teacher'};
      setCurrentUser(response);
    } else {
      response = {error: 'Wrong credentials'};
    }
    return response;
  }

  const registerUser = async (email, password, confirmPassword) => {
    const url = `/api/auth/register`;

    const body = {
      "email": email,
      "password": password,
      "confirmPassword": confirmPassword
    };

    const myHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    const options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow'
    };

    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      throw new Error('Register failed');
    }
  }


  const logout = () =>{

  }

  return (
    <AuthContext.Provider value={{ currentUser, logout, registerUser, signIn }}>
      {children}
    </AuthContext.Provider>
  )
};

export {
  AuthContext,
  AuthProvider,
  useAuth,
}