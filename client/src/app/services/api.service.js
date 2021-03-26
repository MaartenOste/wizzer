import { default as React, useContext, createContext } from 'react';
import { apiConfig } from '../config';
import {useAuth } from './auth.service';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const {currentUser} = useAuth();
  const BASE_URL = `${apiConfig.baseURL}`;

  const getStudentsFromClass = async (classId) => {
    const url = `${BASE_URL}/api/classes/${classId}`;
    try {
      const response = await fetch(url);
      let data = await response.json();
      return data.students
    } catch (error) {
      throw new Error('No students found for this class ID');
    }
  }

  const getExercises = async () => {
    let exercises =  [{id: '2051aze0r4z19azr1505a1zera05451041105160e', name: 'oef2', type: 'Getallenkennis', public:false}, {id: '2051a12aze0r4z19azr1505a1zera054e3751041105160e', name: 'oef1', type: 'Bewerkingen',  public:true}, {id: '2051aze0zr419azr1505aa1zera05451041105160e', name: 'oef3', type: 'Meetkunde',  public:true}, {id: '2051aze0r4ra19azr1505a1zera05451041105160e', name: 'oef4', type: 'Meten en metend rekenen',  public:false}, {id: '2051azee0r419azr1505a1zera05451041105160e', name: 'oef5', type: 'Toepassingen',  public:true}, {id: '20z4751aze0r4z1a9azr1505a174zera0545104110567160e', name: 'oef6', type: 'Getallenkennis',  public:true}];
    exercises.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
    sessionStorage.setItem('exercises', JSON.stringify(exercises));
    return exercises;
  }

  const getExercisesFromClass = async (classId) => {
    const url = `${BASE_URL}/api/classes/${classId}`;
    try {
      const response = await fetch(url);
      let data = await response.json();

      let exerciseData = data._exercises.map((ex, i) => {return {data: data.exercises[i], public: ex.public}}) 
      return exerciseData
    } catch (error) {
      throw new Error('No exercises found for this class ID');
    }
  }

  const getFilledInExerciseFromClass = async (exerciseId) => {
    const url = `${BASE_URL}/api/completed_exercises/${currentUser._classId}/${exerciseId}`;
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
      throw new Error('No completed exercises found for this user');
    }
  }

  return (
    <ApiContext.Provider value={{ 
        getExercises,
        getExercisesFromClass,
        getFilledInExerciseFromClass,
        getFilledInExerciseFromStudent,
        getStudentsFromClass,
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