import { default as React, useContext, createContext, useState } from 'react';
import { apiConfig } from '../config';
import {useAuth } from './auth.service';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const {currenUser} = useAuth();
  const BASE_URL = `${apiConfig.baseURL}`;

  const getStudentsFromClass = async (classId) => {
    const url = `http://localhost:8080/api/classes/${classId}`;
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
    const url = `http://localhost:8080/api/classes/${classId}`;
    try {
      const response = await fetch(url);
      let data = await response.json();

      let exerciseData = data._exercises.map((ex, i) => {return {data: data.exercises[i], public: ex.public}}) 
      return exerciseData
    } catch (error) {
      throw new Error('No exercises found for this class ID');
    }
  }

  const getFilledInExerciseById = async (id, classId=0) => {
    let filledInExercises = [{studentName: 'Senne Wancour zijn ma is een x, laat dat', score:'3/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Laure De Norre', score:'5/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Arno Hernou', score:'5/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Jef Vermeire', score:'4/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Wouter Janssens', score:'4/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Maarten Oste', score:'Nog niet ingediend', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}]
    return filledInExercises;
  }

  const getScoresFromStudent = async (id, classId=0) => {
    let filledInExercises = [{studentName: 'Senne Wancour zijn ma is een x, laat dat', score:'3/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Laure De Norre', score:'5/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef4'}, {studentName: 'Arno Hernou', score:'5/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef3'}, {studentName: 'Jef Vermeire', score:'4/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef2'}, {studentName: 'Wouter Janssens', score:'4/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef5'}, {studentName: 'Maarten Oste', score:'Nog niet ingediend', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef6'}]
    filledInExercises.sort(function(a, b){
      if(a.exerciseName < b.exerciseName) { return -1; }
      if(a.exerciseName > b.exerciseName) { return 1; }
      return 0;
    })
    return filledInExercises;
  }

  return (
    <ApiContext.Provider value={{ 
        getExercises,
        getExercisesFromClass,
        getFilledInExerciseById,
        getScoresFromStudent,
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