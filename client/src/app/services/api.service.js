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
    const url = `${BASE_URL}/api/classes/user/${currentUser.id}`;
    try {
      const response = await fetch(url);
      let data = await response.json();
      setClassIdState(data.id);
      return data;
    } catch (error) {
      throw new Error('No class found for this class ID');
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
    const classUrl = `${BASE_URL}/api/classes/join/${classId}/${currentUser.id}`;

    const options = {
      method: 'POST',
      redirect: 'follow',
    };
    try {
      let classUpdate = await fetch(classUrl, options);
      let data = await classUpdate.json();
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(`Joining class failed, message:${error}`);
    }
  }

  const deleteExerciseFromClass = async (exerciseId) => {
    const classUrl = `${BASE_URL}/api/classes/delete_exercise/${exerciseId}`;
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

    try {
      let classUpdate = await fetch(classUrl, options);
      let data = await classUpdate.json();
      //console.log(data);
      return data;
    } catch (error) {
      throw new Error(`Delete exercise from class failed, message:${error}`);
    }
  }

  const addExerciseToClass = async (exerciseId) => {
    const classUrl = `${BASE_URL}/api/classes/add_exercise/${exerciseId}`;
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

    try {
      let classUpdate = await fetch(classUrl, options);
      let data = await classUpdate.json();
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(`Delete exercise from class failed, message:${error}`);
    }
  }

  const updateClass = async (classData, exerciseId) => {
    console.log(classData.id);
    const classUrl = `${BASE_URL}/api/classes/${classData.id}`;
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

    try {
      let classUpdate = await fetch(classUrl, options);
      let data = await classUpdate.json();
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(`Class Update failed, message:${error}`);
    }
  }

  const getExercises = async (filters= '') => {
    console.log(filters);
    let url = `${BASE_URL}/api/exercises`;
    if (filters !== '') {
      url = `${BASE_URL}/api/exercises?filters=${filters}`;
    }

    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw new Error('No exercises exercises found for these filters user');
    }
  }

  return (
    <ApiContext.Provider value={{
        addExerciseToClass,
        deleteExerciseFromClass,
        getFilledInExerciseFromClass,
        getFilledInExerciseFromStudent,
        getClassFromUser,
        getExercises,
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