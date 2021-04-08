import { default as React, Fragment, useEffect, useState, useCallback} from 'react';
import { NumberLine, NavBar } from '../components';
import {useApi} from '../services'
import {useParams} from 'react-router-dom'

import "react-responsive-carousel/lib/styles/carousel.min.css";

const KeysToComponentMap = {
	"getallenassen": NumberLine,
};

const FillInExercisePage = () => {
	const {getCompletedExerciseById} = useApi();
	const [exercise, setExercise] = useState();
	const {id} = useParams();

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			try {
				let data = await getCompletedExerciseById(id);
				setExercise(data);

			} catch (error) {
				console.error(error);
			}
		}
		fetchdata();
	},[id]);

	useEffect(()=>{
		initFetch();
	}, [initFetch]);

	return (
		<Fragment>

			<NavBar active={'exercises'}/>
		</Fragment>
	);
};

export default FillInExercisePage;