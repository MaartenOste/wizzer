import { default as React, useEffect, useCallback, useState } from 'react';
import { useApi } from '../../services';
import { Button, NumberLine } from '../../components';
import { Carousel } from 'react-responsive-carousel';

const KeysToComponentMap = {
	"getallenassen": {component: NumberLine, autoCorrect: true, instruction: 'Vul de getallen in op de open gelaten plaatsen.'}
};

const difficultyToNl = {
	"first": "Basis",
	"hard": "Moeilijker",
	"medium": "Gemiddeld",
	"easy": "Makkelijker"
};

const ExerciseDetail = ({id}) => {
	const {getExerciseById} = useApi();

	const [slide, setSlide] = useState(0);
	const [exercise, setExercise] = useState();
	const [data, setData] = useState();

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			let data = await getExerciseById(id);
			console.log(data);
			setData(data);

		}
		fetchdata();
	},[getExerciseById, id]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

	useEffect(()=>{
		if (data){
			console.log(data);
			let totalExerciseData ={};

			Object.keys(data.exercises).forEach((el)=>{
				if (el !== 'goEasy' && el !== 'goHard') {
					let temp = data.exercises[el].map((x, i) => {
						let props = {};
						x.forEach((state) => {
							props[state.name] = state.value;
						})
						//props.filledInValues = true;
						return <div className='slide--content' key={i}>
							<div className="slide--content__header">
								<div className='slide--content__header-instruction CreateExercise--card__title' style={{textAlign: 'left'}}>{difficultyToNl[el]}</div>
							</div>
							<div className="slide--content__exercise">
								{React.createElement(KeysToComponentMap[data.subType].component, props)}
							</div>
						</div>
					})
					totalExerciseData[el] = temp
				}
			})
			setExercise(totalExerciseData)
		}
		// eslint-disable-next-line
	}, [data]);

	return (
		<div className="exerciseTypeCard">
			{exercise && 
			<>
				<Carousel 
					swipeable={false}
					showArrows={false}
					showStatus={false}
					showThumbs={false}
					showIndicators={false}
					selectedItem={slide}
				>
					{exercise.first}
					{exercise.easy}
					{exercise.medium}
					{exercise.hard}
				</Carousel>
			
				<div className='FillInExercisePage--container__actions'>
					{slide !== 0 && <Button type='secondary' text={'vorige'} onClick={()=>{setSlide(slide-1)}}/>}
					{slide !== (exercise.first.length + exercise.easy.length*3 -1)
						&& <Button type='primary' extraClasses='ml-auto' text={'volgende'} onClick={()=>{setSlide(slide+1)}}/>}
				</div>
			</>
			}
		</div>
	);
};

export default ExerciseDetail;