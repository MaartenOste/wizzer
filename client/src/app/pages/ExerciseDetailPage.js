import { default as React, Fragment, useCallback, useEffect, useState} from 'react';
import {  useParams } from 'react-router-dom';
import { useApi } from '../services';
import { useHistory } from 'react-router';
import { NavBar, ScoreCard, Title } from '../components';
import * as Routes from '../routes';

const ExerciseDetailPage = () => {
	const history = useHistory();
	const {id} = useParams();
	const [exercises, setExercises] = useState();
	const { getFilledInExerciseFromClass } = useApi();

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			let data = await getFilledInExerciseFromClass(id);
			console.log(data);
			setExercises(data.sort((a,b)=>{return (''+ a.completedBy.lastname).localeCompare(b.completedBy.lastname)}));
		}
		fetchdata();
	},[getFilledInExerciseFromClass, id]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

	return (
		<Fragment>
		<div className='exerciseDetail-container page--content'>
			{exercises && 
				<Title text={exercises[0].exercise.title}/>
			}
			{exercises && exercises.map((exercise, i)=>{
				return <ScoreCard onClick={()=>{exercise.score !== 'Nog niet ingediend' && history.push(Routes.COMPLETED_EXERCISE.replace(':id', exercise.id))}} name={`${exercise.completedBy.firstname} ${exercise.completedBy.lastname}`} score={exercise.score} key={i}/>
			})}
		</div>
		<NavBar active={'exercises'}/>
		</Fragment>
	);
};

export default ExerciseDetailPage;