import { default as React, Fragment, useEffect, useState} from 'react';
import {  useParams, useHistory } from 'react-router-dom';
import { NavBar, Title } from '../components';
import * as Routes from '../routes';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Button} from '../components/buttons';
import { cloneDeep } from 'lodash';
import {useApi} from '../services';
import { default as KeysToComponentMap} from '../components/exercises/KeysToComponentMap';
import {useSwipeable} from 'react-swipeable';


const CreateExerciseDetailPage = () => {
	const history = useHistory();
	const {type} = useParams();
	const [slide, setSlide] = useState(0);
	const {createExercise} = useApi();

	const [amountBefore] = useState(localStorage.getItem('amountBefore') || 0);
	const [amountAfter] = useState(localStorage.getItem('amountAfter') || 0);

	const [exercisesDataBeforeDiff, setExercisesDataBeforeDiff] = useState([]);
	const [exercisesDataAfterDiff, setExercisesDataAfterDiff] = useState([]);
	const [easyExercisesDataAfterDiff, setEasyExercisesDataAfterDiff] = useState([]);
	const [hardExercisesDataAfterDiff, setHardExercisesDataAfterDiff] = useState([]);

	useEffect(()=>{
		if(type && amountBefore && amountAfter){
			let components = [];
			for (let i = 0; i < amountBefore; i++) {
				components.push(cloneDeep(KeysToComponentMap[type].states));
			}
			setExercisesDataBeforeDiff(components);
			components = [];
			for (let i = 0; i < amountAfter; i++) {
				components.push(cloneDeep(KeysToComponentMap[type].states));
			}
			setExercisesDataAfterDiff(components);
			setEasyExercisesDataAfterDiff(components);
			setHardExercisesDataAfterDiff(components);
		} else{
			history.push(Routes.CREATE_EXERCISE);
		}
	},[type, amountBefore, amountAfter, history])

	const handleFinish = async () =>{
		let data = {
			title: localStorage.getItem('newExerciseTitle'),
			description: localStorage.getItem('newExerciseDescription'),
			dueDate: localStorage.getItem('newExerciseDueDate'),
			instructionVideo: '',
			exercises:{
				first: exercisesDataBeforeDiff, 
				easy: easyExercisesDataAfterDiff, 
				medium:exercisesDataAfterDiff, 
				hard:hardExercisesDataAfterDiff, 
				goEasy: parseInt(localStorage.getItem('maxScore'))/parseInt(localStorage.getItem('amountBefore')),
				goHard: parseInt(localStorage.getItem('minScore'))/parseInt(localStorage.getItem('amountBefore'))
			},
			example: KeysToComponentMap[type].states,
			type: localStorage.getItem('exerciseType'),
			subType: localStorage.getItem('exerciseSubType'),
		}
		await createExercise(data);

		localStorage.removeItem('newExerciseTitle');
		localStorage.removeItem('newExerciseDescription');
		localStorage.removeItem('newExerciseDueDate');
		localStorage.removeItem('maxScore');
		localStorage.removeItem('minScore');
		localStorage.removeItem('amountBefore');
		localStorage.removeItem('exerciseType');
		localStorage.removeItem('exerciseSubType');

		localStorage.removeItem('newExOption');
		localStorage.removeItem('completedExerciseGeneral');
		localStorage.removeItem('amountAfter');
		localStorage.removeItem('completedExerciseDif');
		history.push(Routes.EXERCISE);
	}

	
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
			<div className='createExDetailPage--container page--content' {...handlers}>
				<div className='page--heading'>
					<Title text={type}/>
					<Button text='terug' type='primary' onClick={()=> {localStorage.removeItem('exerciseSubType'); history.goBack()}}/>
				</div>
				<Carousel 
					swipeable={false}
					showArrows={false}
					showStatus={false}
					showThumbs={false}
					showIndicators={false}
					selectedItem={slide}
				>
					<div>
						De oefeningen die u op volgende pagina's zal maken tellen als basisoefeningen.
					</div>
					{exercisesDataBeforeDiff && exercisesDataBeforeDiff.map((x, i)=>{
						let props = {};
						x.forEach((state) => {
							props[`${state.name}`] = state.value;
						})
						return <div key={i}>
								<div className='createExDetailPage--settings__container'>
							{x.map((state, j)=>{
								return  <div  className='createExDetailPage--settings__setting' key={j}>
											<div>{state.displayName}</div>
											<input type={state.type} placeholder={state.value.toString()} onChange={(ev)=>{ let temp = cloneDeep(exercisesDataBeforeDiff); temp[i][j].value = state.type==='number'?parseInt(ev.target.value):ev.target.value; setExercisesDataBeforeDiff(temp)}}/>
										</div>
							})}
						</div>
						{React.createElement(KeysToComponentMap[type].componentName, props)}
						</div>
					})}
					<div>
						Vanaf nu maakt u de oefeningen voor een lager niveau.
					</div>

					{easyExercisesDataAfterDiff && easyExercisesDataAfterDiff.map((x, i)=>{
						let props = {};
						x.forEach((state) => {
							props[`${state.name}`] = state.value;
						})
						return <div key={i}>
								<div className='createExDetailPage--settings__container'>
							{x.map((state, j)=>{
								return 	<div  className='createExDetailPage--settings__setting' key={j}>
											<div>{state.displayName}</div>
											<input type={state.type} placeholder={state.value.toString()} onChange={(ev)=>{ let temp = cloneDeep(easyExercisesDataAfterDiff); temp[i][j].value = state.type==='number'?parseInt(ev.target.value):ev.target.value; setEasyExercisesDataAfterDiff(temp)}}/>
										</div>
							})}
						</div>
						{React.createElement(KeysToComponentMap[type].componentName, props)}
						</div>
					})}

					<div>
						Vanaf nu maakt u de oefeningen voor een gemiddeld niveau.
					</div>
					{exercisesDataAfterDiff && exercisesDataAfterDiff.map((x, i)=>{
						let props = {};
						x.forEach((state) => {
							props[`${state.name}`] = state.value;
						})
						return <div key={i}>
								<div className='createExDetailPage--settings__container'>
							{x.map((state, j)=>{
								return 	<div  className='createExDetailPage--settings__setting' key={j}>
											<div>{state.displayName}</div>
											<input type={state.type} placeholder={state.value.toString()} onChange={(ev)=>{ let temp = cloneDeep(exercisesDataAfterDiff); temp[i][j].value = state.type==='number'?parseInt(ev.target.value):ev.target.value; setExercisesDataAfterDiff(temp)}}/>
										</div>
							})}
						</div>
						{React.createElement(KeysToComponentMap[type].componentName, props)}
						</div>
					})}
					<div>
						Vanaf nu maakt u de oefeningen voor een hoger niveau.
					</div>
					{hardExercisesDataAfterDiff && hardExercisesDataAfterDiff.map((x, i)=>{
						let props = {};
						x.forEach((state) => {
							props[`${state.name}`] = state.value;
						})
						return <div key={i}>
								<div className='createExDetailPage--settings__container'>
							{x.map((state, j)=>{
								return 	<div  className='createExDetailPage--settings__setting' key={j}>
											<div>{state.displayName}</div>
											<input type={state.type} placeholder={state.value.toString()} onChange={(ev)=>{ let temp = cloneDeep(hardExercisesDataAfterDiff); temp[i][j].value = state.type==='number'?parseInt(ev.target.value):ev.target.value; setHardExercisesDataAfterDiff(temp)}}/>
										</div>
							})}
						</div>
						{React.createElement(KeysToComponentMap[type].componentName, props)}
						</div>
					})}
				</Carousel>
				<div className='createExDetailPage--container__actions'>
					<Button type='secondary' text='vorige' onClick={()=>{if(slide>0){setSlide(slide-1)} else {localStorage.removeItem('exerciseSubType'); history.push(Routes.CREATE_EXERCISE);}}}/>
					{slide === 3+parseInt(amountBefore)+parseInt(amountAfter)*3?
						<Button type='primary' text='afronden' onClick={()=>{ handleFinish() }}/>
						:
						<Button type='primary' text='volgende' onClick={()=>{setSlide(slide+1)}}/>
					}
				</div>
			</div>
			<NavBar active={'exercises'}/>
		</Fragment>
	);
};

export default CreateExerciseDetailPage;