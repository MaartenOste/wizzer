import { default as React, Fragment, useEffect, useState, useCallback} from 'react';
import { Button, NumberLine, NavBar, Title } from '../components';
import {useApi} from '../services'
import {  useParams, useHistory } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import * as Routes from '../routes';
import { cloneDeep, isEqual } from 'lodash';
import {AiFillInfoCircle} from 'react-icons/ai';

import "react-responsive-carousel/lib/styles/carousel.min.css";

const KeysToComponentMap = {
	"getallenassen": {component: NumberLine, autoCorrect: true, instruction: 'Vul de getallen in op de open gelaten plaatsen.'}
};

const FillInExercisePage = () => {
	const history = useHistory();

	const [slide, setSlide] = useState(0);
	const [exercise, setExercise] = useState();
	const [data, setData] = useState();
	const [totalAnswers, setTotalAnswers] = useState();
	const [totalCorrectValues, setTotalCorrectValues] = useState();
	const [difficulty, setDifficulty] = useState();
	const [example, setExample] = useState();


	const {getCompletedExerciseById, updateCompletedExercise} = useApi();
	const {id} = useParams();

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			try {
				let data = await getCompletedExerciseById(id);

				setData(data);
				let ex = data.exercise.example
				let temp={};
				ex.forEach((state) => {
					temp[`${state.name}`] = state.value;
				})
				temp.inputFieldsPositions = '0';
				setExample(<>{React.createElement(KeysToComponentMap[data.exercise.subType].component, temp)}</>)

			} catch (error) {
				console.error(error);
			}
		}
		fetchdata();
	},[id, getCompletedExerciseById]);

	useEffect(()=>{
		initFetch();
	}, [initFetch]);

	const onTabPress = (ev) =>{
		if (ev.key === 'Tab') {
			ev.preventDefault();
		}
	}

	const handleExample = (id) =>{
		let el = document.getElementById(`example-${id}`);
		if (!el.style.display || el.style.display === 'none') {
			document.getElementById(`example-${id}`).style.display = 'flex'
		} else {
			document.getElementById(`example-${id}`).style.display = 'none'
		}
	}

	useEffect(()=>{
		if (data && example){
			let totalExerciseData = exercise?cloneDeep(exercise):{};
			let answers = totalAnswers?cloneDeep(totalAnswers):{};
			let correctValues = totalCorrectValues?cloneDeep(totalCorrectValues):{};

			let temp = [];
			data.exercise.exercises.first.forEach(() => {
				temp.push([]);
			});
			answers.first = cloneDeep(temp);
			temp = [];

			data.exercise.exercises.easy.forEach(() => {
				temp.push([]);
			});
			answers.easy = cloneDeep(temp);
			answers.medium = cloneDeep(temp);
			answers.hard = cloneDeep(temp);
			correctValues = cloneDeep(answers);
			setTotalAnswers(cloneDeep(answers));
			setTotalCorrectValues(cloneDeep(answers));

			Object.keys(data.exercise.exercises).forEach((el)=>{
				if (el !== 'goEasy' && el !== 'goHard') {
					let temp = data.exercise.exercises[el].map((x, i) => {
						let props = {};
						x.forEach((state) => {
							props[state.name] = state.value;
						})
						props.addCorrectValue = (pos, value) => {
							correctValues[el][i][pos] = value;
							setTotalCorrectValues(cloneDeep(correctValues));
						}
						props.setFillInValues = (pos, value) => {
							answers[el][i][pos] = value;
							
							setTotalAnswers(cloneDeep(answers));
						}
						props.onTabPress = onTabPress;
						return <div className='slide--content' key={i}>
							<div className="slide--content__header">
								<div className='slide--content__header-instruction'>{KeysToComponentMap[data.exercise.subType].instruction}</div>
									<div className='slide--content__example'>
										<div className='slide--content__example-icon' onClick={()=>{handleExample(i)}}><AiFillInfoCircle /></div>
										<div className='slide--content__example-ex' id={`example-${i}`}>
											<>Voorbeeld: </>
											{example}
											<Button type='primary' text='terug'  onClick={()=>{handleExample(i)}}/>
										</div>
									</div>
							</div>
							<div className="slide--content__exercise">
								{React.createElement(KeysToComponentMap[data.exercise.subType].component, props)}
							</div>
						</div>
					})
					totalExerciseData[el] = temp
				}
			})

			setExercise(totalExerciseData)
		}
		// eslint-disable-next-line
	}, [data, example]);

	const handlePreDiff = () =>{
		if(KeysToComponentMap[data.exercise.subType].autoCorrect) {
			let correctAnswers = 0;
			totalCorrectValues.first.forEach((el, i)=>{
				if(isEqual(el,totalAnswers.first[i]))
					correctAnswers++;
			})

			if (correctAnswers/totalCorrectValues.first.length <= data.exercise.exercises.goEasy) {
				console.log('schakelen naar easy');
				setDifficulty('easy')
			} else if (correctAnswers/totalCorrectValues.first.length >= data.exercise.exercises.goHard){
				console.log('schakelen naar hard');
				setDifficulty('hard')
			} else{
				console.log('schakelen naar medium');
				setDifficulty('medium')
			}
		}
		setSlide(slide+1);
	}

	const handleFinish = async () => {
		let score = 'Leerkracht verbetert de oefening';
		let answers = cloneDeep(totalAnswers);

		if(KeysToComponentMap[data.exercise.subType].autoCorrect) {
			answers.difficulty = difficulty;
			let correctAnswers = 0;
			let scorePreDiff = 0;
			let scorePostDiff= 0;
			totalCorrectValues.first.forEach((el, i)=>{
				if(isEqual(el,answers.first[i])){
					correctAnswers++;
					scorePreDiff++;
				}
			})
			totalCorrectValues[difficulty].forEach((el, i)=>{
				if(isEqual(el,answers[difficulty][i])){
					correctAnswers++;
					scorePostDiff++;
				}
			})
			answers.scorePreDiff = `${scorePreDiff}/${data.exercise.exercises.first.length}`;
			answers.scorePostDiff = `${scorePostDiff}/${data.exercise.exercises.easy.length}`
			score = `${correctAnswers}/${data.exercise.exercises.first.length+data.exercise.exercises.easy.length}`
			console.log('finished with data: ', answers);
			console.log('Correct answers: ', totalCorrectValues);
			console.log('correct: ', `${correctAnswers}/${data.exercise.exercises.first.length+data.exercise.exercises.easy.length}=${correctAnswers/(data.exercise.exercises.first.length+data.exercise.exercises.easy.length)}`);
		}


		console.log(totalCorrectValues);
		console.log(id, score, answers);
		await updateCompletedExercise(id, score, answers);
		history.push(Routes.EXERCISE);
	}

	return (
		<Fragment>
			{
				data && example && <div className='FillInExercisePage--container page--content'>
				<Title text={data.exercise.title}/>
				<Carousel 
					swipeable={false}
					showArrows={false}
					showStatus={false}
					showThumbs={false}
					showIndicators={false}
					selectedItem={slide}
				>
					<div>
						<p>{data.exercise.description}</p>
							Je gaat zo meteen een oefening over {data.exercise.subType.replace('-', ' ')} maken. Hier is nog even een voorbeeld:
						{example}
					</div>
					{exercise && exercise.first}
					{exercise && difficulty && exercise[difficulty]}
					<div>
						Het is je gelukt. Dit was het einde van de oefening. Klik nu op indienen.
					</div>
				</Carousel>
				{exercise && <div className='FillInExercisePage--container__actions'>
					<Button type='secondary' text={slide === 0 ?'stoppen':'vorige' }onClick={()=>{slide>0 ? setSlide(slide-1): history.push(Routes.EXERCISE)}}/>
					{slide === data.exercise.exercises.first.length?
						<Button type='primary' text='volgende' onClick={()=>{ handlePreDiff() }}/>
						:
						<>
						{slide === data.exercise.exercises.first.length + data.exercise.exercises.easy.length +1 ?
						<Button type='primary' text='indienen' onClick={()=>{ handleFinish()}}/>
						:
						<Button type='primary' text='volgende' onClick={()=>{setSlide(slide+1)}}/>
						}
						</>
					}
				</div>
				}
			</div>
			}
			<NavBar active={'exercises'}/>
		</Fragment>
	);
};

export default FillInExercisePage;