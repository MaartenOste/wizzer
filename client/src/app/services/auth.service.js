import React, { createContext, useContext, useState } from 'react';
//import { apiConfig } from '../config';

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(/*JSON.parse(sessionStorage.getItem('currentUser'))*/);
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
      response = {
        "localProvider": {
          "password": "$2b$10$lJODQkCZSCsFubor6mLTK.lyf3Oc4uyXdGOMrt7eTh0QmoxLYl8su"
        },
        "smartschoolProvider": {
          "id": "2993ab23-bbc4-4c2c-a8d7-2ad3b1819f4f",
          "token": "d6bfc814-d174-4199-8564-2bbebe062e9e"
        },
        "_createdAt": 1617023561013,
        "_modifiedAt": null,
        "_deletedAt": null,
        "_id": "6061d24bdcdf6525882a011d",
        "firstname": "Kirk",
        "lastname": "Ankunding",
        "email": "Kirk.Ankunding@smartschool.be",
        "userType": "Student",
        "__v": 0,
        "id": "6061d24bdcdf6525882a011d"
      };
    } else if(uname === 'maarten' && password === 'azer'){
      response = {
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
      };
    } else {
      response = {error: 'Wrong credentials'};
    }
    //sessionStorage.setItem('currentUser', JSON.stringify(response));
    setCurrentUser(response);
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
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout, registerUser, signIn }}>
      {children}
    </AuthContext.Provider>
  )
};

export {
  AuthContext,
  AuthProvider,
  useAuth,
}