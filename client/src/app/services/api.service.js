import { default as React, useContext, createContext, useState } from 'react';
//import { apiConfig } from '../config';
import {useAuth } from './auth.service';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const {currentUser, logout} = useAuth();
  const [classIdState, setClassIdState] = useState();
  //const BASE_URL = `${apiConfig.baseURL}`;


  const getClassFromUser = async () => {
    const url = `/api/classes/user/${currentUser.id}`;
    let response;
    try {
      response = await fetch(url);
      let data = await response.json();

      setClassIdState(data.id);
      return data;
    } catch (error) {
      if (response.status === 401 ) {
        await logout();
      }
      else{
        throw new Error(error);
      }
    }
  }

  const getUserById = async (id) =>{
    const url = `/api/users/${id}`;
    let response;

    try {
      response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (response.status === 401 ) {
        await logout();
      }
      else{
        throw new Error(error);
      }
    }
  }

  const getFilledInExerciseFromClass = async (exerciseId) => {
    const url = `/api/completed_exercises/${classIdState}/${exerciseId}`;
    let response;

    try {
      response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (response.status === 401 ) {
        await logout();
      }
      else{
        throw new Error(error);
      }
    }
  }

  const getFilledInExercisesFromStudent = async (id) => {
    const url = `/api/completed_exercises/user/${id}`;
    let response;

    try {
      response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (response.status === 401 ) {
        await logout();
      }
      else{
        throw new Error(error);
      }
    }
  }

  const joinClassRoom = async (classId) => {
    console.log('in join');
    const classUrl = `/api/classes/join/${classId}/${currentUser.id}`;

    const options = {
      method: 'POST',
      redirect: 'follow',
    };
    let response;

    try {
      response = await fetch(classUrl, options);
      let data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      if (response.status === 401 ) {
        await logout();
      }
      else{
        throw new Error(error);
      }
    }
  }

  const deleteExerciseFromClass = async (exerciseId) => {
    const classUrl = `/api/classes/delete_exercise/${exerciseId}`;
    const myHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    const options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({userId: currentUser.id}),
      redirect: 'follow',
    };
    let response;

    try {
      response = await fetch(classUrl, options);
      let data = await response.json();
      return data;
    } catch (error) {
      if (response.status === 401 ) {
        await logout();
      }
      else{
        throw new Error(error);
      }
    }
  }

  const addExerciseToClass = async (exerciseId) => {
    const classUrl = `/api/classes/add_exercise/${exerciseId}`;
    const myHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    const options = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({userId: currentUser.id}),
      redirect: 'follow',
    };
    let response;

    try {
      response = await fetch(classUrl, options);
      let data = await response.json();
      return data;
    } catch (error) {
      if (response.status === 401 ) {
        await logout();
      }
      else{
        throw new Error(error);
      }
    }
  }

  const updateClass = async (classData, exerciseId) => {
    console.log(classData.id);
    const classUrl = `/api/classes/${classData.id}`;
    const myHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    let index = classData._exercises.indexOf(classData._exercises.find((ex)=>ex._exerciseGroupId === exerciseId));

    classData._exercises[index].public = !classData._exercises[index].public;

    const options = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(classData),
      redirect: 'follow',
    };

    let response;


    try {
      response = await fetch(classUrl, options);
      let data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      if (response.status === 401 ) {
        await logout();
      }
      else{
        throw new Error(error);
      }
    }
  }

  const getExercises = async (filters= '') => {
    console.log(filters);
    let url = `/api/exercises`;
    if (filters !== '') {
      url = `/api/exercises?filters=${filters}`;
    }
    let response;

    try {
      response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (response.status === 401 ) {
        await logout();
      }
      else{
        throw new Error(error);
      }
    }
  }

  return (
    <ApiContext.Provider value={{
        addExerciseToClass,
        deleteExerciseFromClass,
        getFilledInExerciseFromClass,
        getFilledInExercisesFromStudent,
        getClassFromUser,
        getExercises,
        getUserById,
        joinClassRoom,
        updateClass
      }}>
      {children}
    </ApiContext.Provider>
  );
};

export {
  ApiContext,
  ApiProvider,
  useApi,
}