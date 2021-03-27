import { default as React, useContext, createContext, useState } from 'react';
import { apiConfig } from '../config';
import {useAuth } from './auth.service';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const {currentUser} = useAuth();
  const [classIdState, setClassIdState] = useState();
  const BASE_URL = `${apiConfig.baseURL}`;

  const getClassFromUser = async () => {
    const url = `${BASE_URL}/api/classes/user/${currentUser._id.$oid}`;
    try {
      const response = await fetch(url);
      let data = await response.json();
      setClassIdState(data.id);
      return data;
    } catch (error) {
      throw new Error('No students found for this class ID');
    }
  }

  const getFilledInExerciseFromClass = async (exerciseId) => {
    const url = `${BASE_URL}/api/completed_exercises/${classIdState}/${exerciseId}`;
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw new Error('No completed exercises found for this user');
    }
  }

  const getFilledInExerciseFromStudent = async (id) => {
    const url = `${BASE_URL}/api/completed_exercises/user/${id}`;
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw new Error('No students found for this exercise');
    }
  }

  const joinClassRoom = async (classId) => {
    const classUrl = `${BASE_URL}/api/classes/join/${classId}/${currentUser._id.$oid}`;
    const myHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    const update = {...currentUser, _classId: classId}
    const options = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(update),
      redirect: 'follow',
    };
    try {
      let classUpdate = await fetch(classUrl, {...options, method:'POST', body:JSON.stringify({id:classId, userId:currentUser._id.$oid})});
      let data = await classUpdate.json();
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(`User Update failed, message:${error}`);
    }
  }


  return (
    <ApiContext.Provider value={{ 
        getFilledInExerciseFromClass,
        getFilledInExerciseFromStudent,
        getClassFromUser,
        joinClassRoom
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