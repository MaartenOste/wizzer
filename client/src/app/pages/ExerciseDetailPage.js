import { default as React, Fragment, useCallback, useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';
import * as Routes from '../routes';
import { useApi } from '../services';
import { useHistory } from 'react-router';
import { NavBar, Title } from '../components';

const ExerciseDetailPage = () => {
	const {id} = useParams();
	const [exercise, setExercise] = useState();
	const { getExerciseById } = useApi();

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			let data = await getExerciseById(id);
			console.log(data);
			setExercise(data);
		}
		fetchdata();
	},[]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

	return (
		<Fragment>
		<div className='exerciseDetail-container'>
			{exercise && 
				<Title text={exercise[0].exerciseName}/>
			}
			
		</div>
		<NavBar active={'exercises'}/>
		</Fragment>
	);
};

export default ExerciseDetailPage;