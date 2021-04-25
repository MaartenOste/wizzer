import { default as React, Fragment, useCallback, useEffect, useState} from 'react';
import { Button, NumberLine, NavBar, Title, MentalMath } from '../components';
import { useApi, useAuth} from '../services';
import * as Routes from '../routes';
import { useParams, useHistory } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useSwipeable } from 'react-swipeable';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const KeysToComponentMap = {
	"getallenassen": {component: NumberLine, autoCorrect: true, instruction: 'Vul de getallen in op de open gelaten plaatsen.'},
	"hoofdrekenen": {component: MentalMath, autoCorrect: true, instruction: 'Los de oefeningen op.'}
};

const difficultyToNl = {
	"hard": "moeilijker",
	"medium": "gemiddeld",
	"easy": "makkelijker"
};

const FilledInExercisePage = () => {
	const {id} = useParams();
	const history = useHistory();
	const {getCompletedExerciseById} = useApi();
	const {currentUser} = useAuth();
	const [data, setData] = useState();
	const [exercise, setExercise] = useState();

	const onTabPress = (ev) =>{
		if (ev.key === 'Tab') {
			ev.preventDefault();
		}
	}

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			try {
				let temp = await getCompletedExerciseById(id);
				setData(temp);
			} catch (error) {
				console.error(error);
			}
		}
		fetchdata();
	},[id, getCompletedExerciseById]);

	useEffect(()=>{
		initFetch();
	}, [initFetch]);

	useEffect(()=>{
		if (data) {
			let correctValues = {};
	
			let temp = [];
			data.exercise.exercises.first.forEach(() => {
				temp.push([]);
			});
			correctValues.first = cloneDeep(temp);
			temp = [];

			data.exercise.exercises.easy.forEach(() => {
				temp.push([]);
			});
			correctValues[data.answers.difficulty] = cloneDeep(temp);
			let totalExerciseData= {};
			Object.keys(data.exercise.exercises).forEach((el)=>{
				if (el === 'first' || el === data.answers.difficulty) {
					let temp = data.exercise.exercises[el].map((x, i) => {
						let props = {};
						x.forEach((state) => {
							props[state.name] = state.value;
						})
						props.addCorrectValue = (pos, value) => {
							correctValues[el][i][pos] = value;
						}
						props.onTabPress = onTabPress;
						props.filledInValues = data.answers[el][i];
						return <div className='filledInExercise--container' key={i}>
								<div className='filledInExercise--container__card'>
									<div className='filledInExercise--container__title'>
										Oefening {el === 'first'?i+1: data.answers[el].length + i+2}
									</div>
									{React.createElement(KeysToComponentMap[data.exercise.subType].component, props)}
								</div>
						</div>
					})
					totalExerciseData[el] = temp
				}
				setExercise(totalExerciseData)
			})
		}
	}, [data]);

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

	return (
		<Fragment>
			<div className='page--content' {...handlers}>
				{data && exercise && currentUser &&
				<>
					<div className='page--heading'>
						<Title text={data.exercise.title}/>
						<Button text='terug' type='primary' onClick={()=> {history.goBack()}}/>
					</div>
					{currentUser && currentUser.userType === 'Teacher'? <div className='filledInExercise--container__diftitle'>Voor differentiëren</div> :<div></div>}
					{data && exercise && exercise.first}
					{currentUser && currentUser.userType === 'Teacher'? <div className='filledInExercise--container__diftitle'>Na differentiëren ({difficultyToNl[data.answers.difficulty]})</div> :<div></div>}
					{data && exercise && exercise[data.answers.difficulty]}
				</>
				}
			</div>
			<NavBar active={'exercises'}/>
		</Fragment>
	);
};

export default FilledInExercisePage;