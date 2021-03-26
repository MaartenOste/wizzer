import { default as React, Fragment, useCallback, useEffect, useState} from 'react';
import {  useParams } from 'react-router-dom';
import { useApi } from '../services';
//import { useHistory } from 'react-router';
import { NavBar, ScoreCard, Title } from '../components';

const ExerciseDetailPage = () => {
	const {id} = useParams();
	const [exercises, setExercises] = useState();
	const { getFilledInExerciseFromClass } = useApi();

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			let data = await getFilledInExerciseFromClass(id);
			console.log(data);
			setExercises(data);
		}
		fetchdata();
	},[getFilledInExerciseFromClass, id]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

	return (
		<Fragment>
		<div className='exerciseDetail-container'>
			{exercises && 
				<Title text={exercises[0].exercise.title}/>
			}
			{exercises && exercises.map((exercise, i)=>{
				return <ScoreCard name={`${exercise.completedBy.firstname} ${exercise.completedBy.lastname}`} score={exercise.score} key={i}/>
			})}
		</div>
		<NavBar active={'exercises'}/>
		</Fragment>
	);
};

export default ExerciseDetailPage;