import { default as React, useContext, createContext, useState } from 'react';
import { apiConfig } from '../config';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
  const BASE_URL = `${apiConfig.baseURL}`;

  const getStudents = async () => {
    let students =  [{id: '205a1aze0r419azr1505a1zera05451041105160e', name: 'Senne Wancour', type: 'student'},{id: '2051aze0r4azerraa19azr1505a1zera0a5451041105160e', name: 'Laure De Norre', type: 'student'}, {id: '2051aze0r4a19azr1505a1zera0a5451041105160e', name: 'Arno Hernou', type: 'student'}, {id: '2051aze0ar419azr1505a1zera0aa5451041105160e', name: 'Jef Vermeire', type: 'student'}, {id: '2051aze0r419azar1505a1zera05451041105a160e', name: 'Wouter Janssens', type: 'student'}, {id: '2051aaze0raa419azar1a505a1zera0545aezr1041105araa160e', name: 'Maarten Oste', type: 'student'}];
    sessionStorage.setItem('students', JSON.stringify(students));
    return students;
  }

  const getExercises = async () => {
    let exercises =  [{id: '2051aze0r4z19azr1505a1zera05451041105160e', name: 'oef1', type: 'Getallenkennis', public:false}, {id: '2051a12aze0r4z19azr1505a1zera054e3751041105160e', name: 'oef2', type: 'Bewerkingen',  public:true}, {id: '2051aze0zr419azr1505aa1zera05451041105160e', name: 'oef3', type: 'Meetkunde',  public:true}, {id: '2051aze0r4ra19azr1505a1zera05451041105160e', name: 'oef4', type: 'Meten en metend rekenen',  public:false}, {id: '2051azee0r419azr1505a1zera05451041105160e', name: 'oef5', type: 'Toepassingen',  public:true}, {id: '20z4751aze0r4z1a9azr1505a174zera0545104110567160e', name: 'oef6', type: 'Getallenkennis',  public:true}];
    sessionStorage.setItem('exercises', JSON.stringify(exercises));
    return exercises;
  }

  const getExerciseById = async (id, classId=0) => {
    let filledInExercises = [{studentName: 'Senne Wancour', score:'3/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Laure De Norre', score:'5/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Arno Hernou', score:'5/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Jef Vermeire', score:'4/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Wouter Janssens', score:'4/5', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}, {studentName: 'Maarten Oste', score:'Nog niet ingediend', exerciseId: '2051aze0r4z19azr1505a1zera05451041105160e', exerciseName:'oef1'}]
    return filledInExercises;
  }

  return (
    <ApiContext.Provider value={{ 
        getExercises,
        getExerciseById,
        getStudents,
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