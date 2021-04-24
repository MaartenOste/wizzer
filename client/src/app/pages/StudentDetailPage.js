import { default as React, Fragment, useCallback, useState, useEffect} from 'react';
import { useApi, useAuth } from '../services';
import { useParams } from 'react-router';
import { Button, NavBar, ScoreCard, Title } from '../components';
import { useHistory } from 'react-router-dom';
import * as Routes from '../routes';
import {useSwipeable} from 'react-swipeable';

const StudentDetailPage = () => {
	const history = useHistory();
	const [exercises, setExercises] = useState();
	const { getFilledInExercisesFromStudent } = useApi();
	const {currentUser} = useAuth();
	const { id } = useParams();

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			let data = await getFilledInExercisesFromStudent(id);
			console.log(data);
			data = data.map((ex)=> {
				return {
				id: ex.id,
				public: ex.class._exercises.find((x) => ex._exerciseId === x._exerciseGroupId).public, 
				_addedAt: ex.class._exercises.find((x) => ex._exerciseId === x._exerciseGroupId)._addedAt, 
				score: ex.score,
				completedBy: `${ex.completedBy.firstname} ${ex.completedBy.lastname}`,
				dueDate: ex.class._exercises.find((x) => ex._exerciseId === x._exerciseGroupId).dueDate?.split('-').reverse().join('/') || new Date().toJSON().slice(0,10).replace(/-/g,'/').split('/').reverse().join('/'),
				title: ex.exercise.title
			}})
			if (currentUser.userType === 'Student') {
				data = data.filter((ex) => {return ex.public});
			}
			console.log(data);
			setExercises(data.sort((a,b)=>{return b._addedAt - a._addedAt }));
		}
		fetchdata();
	},[getFilledInExercisesFromStudent, id, currentUser]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

	const handleSwipeMenu = (deltaX) =>{
		if (deltaX <= -50) {
			history.push(Routes.EXERCISE);
		}
	}

	const handlers = useSwipeable({
		onSwipedLeft: (ev)=>{handleSwipeMenu(ev.deltaX)},
	});


  return (
    <Fragment>
      <div className='studentDetailPage-container page--content' {...handlers}>
	  	{exercises && 
			<div className='page--heading'>
				<Title text={exercises[0].completedBy}/>
				<Button text='terug' type='primary' onClick={()=> {history.goBack()}}/>
			</div>
		}

		  
		{exercises && exercises.map((exercise, i)=>{
			return <ScoreCard onClick={()=>{exercise.score !== 'Nog niet ingediend' && history.push(Routes.COMPLETED_EXERCISE.replace(':id', exercise.id))}} name={exercise.title} score={exercise.score === 'Nog niet ingediend' && new Date(exercise.dueDate.split('/').reverse().join('-'))- new Date()<0 ? 'Te laat...': exercise.score} key={i} extraClasses={!exercise.public?'PrivateExercise':''}/>
		})}
	</div>
	<NavBar active={'class'}/>
    </Fragment>
  );
};

export default StudentDetailPage;