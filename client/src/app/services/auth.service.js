import React, { createContext, useContext, useState } from 'react';
//import { apiConfig } from '../config';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState( getCookie('wizzerUser')?JSON.parse(getCookie('wizzerUser')) : null /*{
    "localProvider": {
      "password": "$2b$10$JOmpJ0WY2GSeeyrH5BQDxuRoKLiJEvl55qPVrpZKl0irrGgL3TSdu"
    },
    "smartschoolProvider": {
      "id": "a4d1b01a-42a8-4bb1-a648-cca2824597f3",
      "token": "b337005c-bd05-45f2-bd52-4887640dc0ff"
    },
    "_createdAt": 1617023561013,
    "_modifiedAt": null,
    "_deletedAt": null,
    "_id": "6061d24bdcdf6525882a014d",
    "firstname": "Porter",
    "lastname": "Glover",
    "email": "Porter2@smartschool.be",
    "userType": "Teacher",
    "__v": 0,
    "id": "6061d24bdcdf6525882a014d"
  }*/);

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
      setCookie('wizzerUser' , 'loggedOut', -500);
      setCurrentUser(null);
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw new Error('No completed exercises found for this user');
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