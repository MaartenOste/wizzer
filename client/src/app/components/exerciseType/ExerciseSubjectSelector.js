import { default as React, useState } from 'react';

const ExerciseSubjectSelector = ({onClick=()=>{}}) => {
	const [types] = useState(['Getallenkennis', 'Bewerkingen','Meetkunde', 'Meten en metend rekenen', 'Toepassingen']);


  return (
    <div className='exersiseTypeSelector-container'>
		<span>Kies een onderwerp</span>
		{types && types.map((type, i)=>{
			return <div onClick={()=>{const name = type.toLowerCase().split(' ').join('_'); localStorage.setItem('exerciseType', name); onClick(name)}} className={`exersiseTypeSelector--card ${type.toLowerCase().split(' ').join('_')}`} key={i}>{type}</div>
		})}
    </div>
  );
};

export default ExerciseSubjectSelector;