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
        "_id": {
            "$oid": "605ce75f19a35a0248e41968"
        },
        "_classId": null,
        "_createdAt": 1616701276221,
        "_modifiedAt": null,
        "_deletedAt": null,
        "firstname": "Ken",
        "lastname": "Erdman",
        "email": "Ken_Erdman88@smartschool.be",
        "userType": "Student",
        "localProvider": {
            "password": "$2b$10$HzB33MQU9nESns6Sa/w4de1hRbUcxPMtaCKvChH4M46t66XssezQa"
        },
        "smartschoolProvider": {
            "id": "7e141455-2f46-4f4a-9930-7340fe8bcd49",
            "token": "3524a1b9-2b31-4a7b-8414-ed58edc69715"
        },
        "__v": 0
    };
    } else if(uname === 'maarten' && password === 'azer'){
      response = {
        "_id": {
            "$oid": "605ce75f19a35a0248e4199a"
        },
        "_classId": null,
        "_createdAt": 1616701276221,
        "_modifiedAt": null,
        "_deletedAt": null,
        "firstname": "Lera",
        "lastname": "Hessel",
        "email": "Lera10@smartschool.be",
        "userType": "Teacher",
        "localProvider": {
            "password": "$2b$10$3vTcRkAsl4cHhbwaBsfxvurUKRVJ8eNg6Bcy2dVrjfJpDSYCadFou"
        },
        "smartschoolProvider": {
            "id": "8ad74f4b-c377-4c9a-a27f-4de140177fc8",
            "token": "e58eef1a-ba5f-4b55-8674-d3dc6f99996f"
        },
        "__v": 0
    }

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