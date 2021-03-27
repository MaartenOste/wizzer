import { default as React, Fragment, useCallback, useEffect, useState} from 'react';
import * as Routes from '../routes';
import { useAuth, useApi } from '../services';
import { useHistory } from 'react-router';
import { AddButton, ExerciseCard, Filter, NavBar, Title } from '../components';
import {useSwipeable} from 'react-swipeable';


const ExercisesPage = () => {
	const history = useHistory();
	const {currentUser} = useAuth();
	const { getClassFromUser } = useApi();

	const [exercises, setExercises] = useState([]);
	const [filteredExercises, setFilteredExercises] = useState();
	const [hasClass, setHasClass] = useState();


	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			try {
				let data = await getClassFromUser();
				setExercises(data._exercises.map((ex, i) => {return {data: data.exercises[i], public: ex.public}}));
				setHasClass(true);
			} catch (error) {
				setHasClass(false);
				console.error(error.message)
			}
		}
		fetchdata();
	},[getClassFromUser]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

	const handleSwipeMenu = (deltaX) =>{
		if (deltaX >= 50) {
			history.push(Routes.CLASSGROUP);
		}
	}

	const handlers = useSwipeable({
		onSwipedLeft: (ev)=>{handleSwipeMenu(ev.deltaX, 'exercises')},
		onSwipedRight: (ev)=>{handleSwipeMenu(ev.deltaX, 'class')}
	});

	const deleteExercise = (id)=>{
		let temp = exercises;
		let index = temp.indexOf(temp.find((x)=>{return x.data.id === id}));
		temp.splice(index,1);
		setExercises([...temp]);

		let temp2 = filteredExercises;
		if (Array.isArray(temp2)) {
			let index2 = temp2.indexOf(temp2.find((x)=>{return x.data.id === id}));
			if (index2>=0) {
				temp2.splice(index2,1);
				setFilteredExercises([...temp2]);
			}
		}
	}

	const makeExercisePublic = (id)=>{
		let temp = [...exercises];
		let index = temp.indexOf(temp.find((x)=>{return x.data.id === id}));

		let localEx = {...temp[index]};
		localEx.public = !localEx.public;

		temp[index] = localEx;
		
		setExercises([...temp]);

		let temp2 = filteredExercises;
		if (Array.isArray(temp2)) {
			let index2 = temp2.indexOf(temp2.find((x)=>{return x.data.id === id}));
			if (index2>=0) {
				temp2[index].public = !temp2[index].public;
				setFilteredExercises([...temp2]);
			}
		}
	}

  return (
	<Fragment>
		<div className='homePage-container' {...handlers}>
			<div className='exercises--container'>
				{hasClass?
				<>
				<div className='homePage--heading'>
					<Title text='Oefeningen'/>
				</div>
				{hasClass?
				<>
				{currentUser.userType === 'Teacher' && 
				<>
					<Filter data={exercises} setData={setFilteredExercises}/>
					<AddButton onClick={()=>{history.push(Routes.CREATE_EXERCISE)}}/>
				</>
				}
				{Array.isArray(filteredExercises) ?
					filteredExercises.length >0?
						<>
							{filteredExercises.map((ex, i) => {
								return <ExerciseCard key={i} id={ex.data.id} name={ex.data.title} isPublic={ex.public} deleteExercise={deleteExercise} makeExercisePublic={makeExercisePublic}/>
							})}
						</>
						:
						<>
							Geen oefenignen gevonden voor de geselecteerde filters.
						</>
				:
				<>
					{exercises && exercises.map((ex, i) => {
						return <ExerciseCard key={i}  id={ex.data.id} name={ex.data.title} isPublic={ex.public} deleteExercise={deleteExercise} makeExercisePublic={makeExercisePublic}/>
					})}
				</>
				}
				</>
				:
				'Je ziet nog niet in een klas'}
				</>
				:'Laden'
				}
			</div>
		</div>
		<NavBar active={'exercises'}/>
	</Fragment>
  );
};

export default ExercisesPage;