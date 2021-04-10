import React, { createContext, useContext, useState } from 'react';
//import { apiConfig } from '../config';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState( getCookie('wizzerUser')?JSON.parse(getCookie('wizzerUser')) : null);

  function setCookie(cname, cvalue, time= 3600000) {
    var d = new Date();
    d.setTime(d.getTime() + (time));
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
    return "";
  }

  const signIn = async () => {
    const classUrl = `http://localhost:8080/api/login/smartschool`;

    try {
      window.location.href = classUrl;
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  }

  const logout = async () =>{
    const url = `/api/logout`;
    try {
      await fetch(url);
      setCookie('wizzerUser' , 'loggedOut', -500);
      setCurrentUser(null);
    } catch (error) {
      throw new Error('Logging out failed');
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout, signIn, setCookie }}>
      {children}
    </AuthContext.Provider>
  )
};

export {
  AuthContext,
  AuthProvider,
  useAuth,
}