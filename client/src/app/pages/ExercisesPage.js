import { default as React, Fragment, useCallback, useEffect, useState} from 'react';
import * as Routes from '../routes';
import { useAuth, useApi } from '../services';
import { useHistory } from 'react-router';
import { AddButton, ExerciseCard, Filter, NavBar, ScoreCard, ToDoExerciseCard, Title } from '../components';
import { useSwipeable } from 'react-swipeable';
import { cloneDeep } from 'lodash';

const ExercisesPage = () => {
	const history = useHistory();
	const {currentUser} = useAuth();
	const { deleteExerciseFromClass, getClassFromUser, getFilledInExercisesFromStudent, updateClass } = useApi();

	const [classData, setClassData] = useState();
	const [exercises, setExercises] = useState([]);
	const [filteredExercises, setFilteredExercises] = useState();
	const [hasClass, setHasClass] = useState(null);

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			try {
				let data;
				if (currentUser.userType === 'Teacher') {
					data = await getClassFromUser();
					setClassData(data);
				} else {
					data = await getFilledInExercisesFromStudent(currentUser.id);
					
					data = data.map((ex)=> {
						return {
						public: ex.class._exercises.find((x) => ex._exerciseId === x._exerciseGroupId).public, 
						_addedAt: ex.class._exercises.find((x) => ex._exerciseId === x._exerciseGroupId)._addedAt, 
						score: ex.score,
						completedBy: `${ex.completedBy.firstname} ${ex.completedBy.lastname}`,
						title: ex.exercise.title,
						dueDate: ex.class._exercises.find((x) => ex._exerciseId === x._exerciseGroupId).dueDate?.split('-').reverse().join('/'),
						id: ex._id
					}}).filter((ex) => {return ex.public}).sort((a,b)=>{return b._addedAt - a._addedAt });
					setExercises(data);
				}
				setHasClass(true);
			} catch (error) {
				setHasClass(false);
			}
		}
		fetchdata();
	},[getClassFromUser, currentUser, getFilledInExercisesFromStudent]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);
	
	useEffect(()=>{
		if (classData && classData._exercises && currentUser.userType === 'Teacher') {
			let temp = classData._exercises.map((ex) => {
				return { ...ex, data: classData.exercises.find((x)=>x.id === ex._exerciseGroupId)}
			})
			if (currentUser.userType === 'Student') {
				temp = temp.filter((ex) => {return ex.public})
			}
			setExercises(temp.sort((a,b)=>{return b._addedAt - a._addedAt }));
		}
	},[classData, currentUser])

	const handleSwipeMenu = (deltaX) =>{
		if (deltaX >= 50) {
			history.push(Routes.CLASSGROUP);
		} else if(deltaX <= -50){
			history.push(Routes.SETTINGS);
		}
	}

	const handlers = useSwipeable({
		onSwipedLeft: (ev)=>{handleSwipeMenu(ev.deltaX)},
		onSwipedRight: (ev)=>{handleSwipeMenu(ev.deltaX)}
	});

	const deleteExercise = async (id)=>{

		let temp = cloneDeep(exercises);
		let index = temp.indexOf(temp.find((x)=>{return x.data.id === id}));
		temp.splice(index,1);
		setExercises(temp);

		let temp2 = cloneDeep(filteredExercises);
		if (Array.isArray(temp2)) {
			let index2 = temp2.indexOf(temp2.find((x)=>{return x.data.id === id}));
			if (index2>=0) {
				temp2.splice(index2,1);
				setFilteredExercises([...temp2]);
			}
		}		
		const response = await deleteExerciseFromClass(id);
		setClassData(response);
	}

	const makeExercisePublic = async (id)=>{
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

		const response = await updateClass({...classData}, id);
		setClassData(response);
	}

  return (
	<Fragment>
		<div className='homePage-container page--content' {...handlers}>
				<div className='page--heading'>
					<Title text='Oefeningen'/>
				</div>
			<div className='exercises--container'>
				{hasClass !== null ?
				<>

				{hasClass?
					<>
					{currentUser.userType === 'Teacher' && 
					<>
						{exercises && 
						<div className='webFilters'>
							<Filter data={exercises} setData={setFilteredExercises}/>
							<AddButton onClick={()=>{history.push(Routes.CREATE_EXERCISE)}}/>
						</div>
						}
					</>
					}
					{Array.isArray(filteredExercises) ?
						filteredExercises.length >0?
							<div className={`exercises--mapped__container ${currentUser.userType === 'Teacher'?'teacherexercise':''}`}>
								{filteredExercises.map((ex, i) => {
									return <ExerciseCard key={i} id={ex.data.id} name={ex.data.title} isPublic={ex.public} deleteExercise={deleteExercise} makeExercisePublic={makeExercisePublic}/>
								})}
							</div>
							:
							<div className={`exercises--mapped__container ${currentUser.userType === 'Teacher'?'teacherexercise':''}`}>
								{exercises.length>0 ?'Geen oefenignen gevonden voor de geselecteerde filters.':'Er zijn nog geen oefeningen aan deze klas toegevoegd'}
							</div>
					:
					<div className={`exercises--mapped__container ${currentUser.userType === 'Teacher'?'teacherexercise':''}`}>
					{exercises.length>0 ? exercises.map((ex, i) => {
							if(currentUser.userType === 'Teacher'){
								//console.log('exercise: ', ex);
								return <ExerciseCard key={i}  id={ex.data.id} name={ex.data.title} isPublic={ex.public} deleteExercise={deleteExercise} makeExercisePublic={makeExercisePublic}/>}
							else {
								if(ex.score === 'Nog niet ingediend'){
									return <ToDoExerciseCard id={ex.id} name={ex.title} score={ex.score} key={i} dueDate={ex.dueDate}/>
								} else {
									return <ScoreCard onClick={()=>{history.push(Routes.COMPLETED_EXERCISE.replace(':id', ex.id))}} name={ex.title} score={ex.score} key={i}/>
								}
							}
						}):
						'Er zijn nog geen oefeningen aan deze klas toegevoegd'
						}
					</div>
					}
					</>
				:
					<>
						{currentUser.userType === 'Student' ? 'Je ziet nog niet in een klas, klik op de link die je leerkracht je stuurde om bij een klas aan te sluiten':'maak een klas'}
					</>
				}
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