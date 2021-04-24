import { default as React, useEffect, useState, useCallback} from 'react';
import { Button, ExerciseSubjectSelector, NavBar, NewExOptionCard, Title, Input } from '../components';
import {IoMdCreate} from 'react-icons/io'
import { IoSearch } from 'react-icons/io5';
import { useApi } from '../services';
import { useHistory } from 'react-router-dom'
import * as Routes from '../routes';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ExerciseDetail from '../components/exercises/ExerciseDetail';
import {useSwipeable} from 'react-swipeable';

const CreateExercisePage = () => {
	const history = useHistory();
	const {addExerciseToClass, getExercises,} = useApi();

	const [newExOption, setNewExOption] = useState(localStorage.getItem('newExOption') || '');
	const [exerciseType, setExerciseType] = useState(localStorage.getItem('exerciseType') || '');
	const [exerciseSubType, setexerciseSubType] = useState('');
	const [completedExerciseGeneral, setCompletedExerciseGeneral] = useState(localStorage.getItem('completedExerciseGeneral') || false);
	const [completedExerciseDif, setCompletedExerciseDif] = useState(localStorage.getItem('completedExerciseDif') || false);

	const [title, setTitle] = useState(localStorage.getItem('newExerciseTitle') || '');
	const [description, setDescription] = useState(localStorage.getItem('newExerciseDescription') || '');
	const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0,10));
	const [videoUrl, setVideoUrl] = useState(localStorage.getItem('newExerciseVideoUrl') || '');

	const [amountBefore, setAmountBefore] = useState(localStorage.getItem('amountBefore') || '');
	const [amountAfter, setAmountAfter] = useState(localStorage.getItem('amountAfter') || '');
	const [minScore, setMinScore] = useState(localStorage.getItem('minScore') || '');
	const [maxScore, setMaxScore] = useState(localStorage.getItem('maxScore') || '');
	const [selectedExercise, setSelectedExercise] = useState(localStorage.getItem('selectedExercise') || '');

	const [dataForSubType, setDataForSubType] = useState();
	const [wasCreatingExercise, setWasCreatingExercise] = useState(false);


	const getSubTypeData = useCallback(() => {
		const fetchdata = async () => {
			try {
				let data = await getExercises(`subType:${exerciseSubType}`);
				setDataForSubType(data);

			} catch (error) {
				console.error(error);
			}
		}
		fetchdata();
	},[getExercises, exerciseSubType]);

	useEffect(()=>{
		if (newExOption === 'choose' && exerciseSubType !== '') {
			getSubTypeData();
		}
		// eslint-disable-next-line
	}, [exerciseSubType])

	const exerciseTypes = {getallenkennis:['Getallen gebruiken om te zeggen hoeveel er zijn',
		'Getallen gebruiken in een rangorde',
		'Getallen gebruiken bij een maateenheid',
		'Getallen gebruiken in een bewerking',
		'Getallen gebruiken als code',
		'Honderdvelden',
		'Getallenassen',
		'We vergelijken en ordenen natuurlijke getallen',
		'Duizendtal, honderdtal, tiental en eenheid',
		'We structureren getallen',
		'Tellen, terugtellen en doortellen per 1, per 2, per 5, per 10, per 50 of per 100',
		'Patronen',
		'Schatten',
		'Afronden',
		'Even getallen',
		'Oneven getallen',
		'Ik deel 18',
		'Gemeenschappelijke delers',
		'Kenmerken van deelbaarheid',
		'Veelvouden',
		'Breuken',
		'De breukenladder',
		'Stambreuken',
	],
	bewerkingen:[
		'Ik ken rekentaal',
		'Eigenschappen van en relaties tussen bewerkingen',
		'Ik controleer met de omgekeerde bewerking',
		'Hoofdrekenen (optellen, aftrekken, vermenigvuldigen en delen)',
		'Maaltafels en de deeltafels/delingstafels',
		'Hoofdrekenen met breuken',
		'Schatten',
		'Cijferen - Optellen',
		'Cijferen - Aftrekken',
		'Cijferen - Vermenigvuldigen',
		'Cijferen - Delen',
	],
	meetkunde:[
		'Meten door te vergelijken',
		'Meten met natuurlijke maateenheden',
		'Lengte',
		'Inhoud',
		'Gewicht',
		'Tijd',
		'Geldwaarden',
		'Temperatuur'
	],
	meten_en_metend_rekenen:[
		'We oriënteren ons ruimtelijk',
		'Rechte lijnen',
		'Oppervlakken',
		'Vlakke figuren',
		'Hoeken',
		'Veelhoeken',
		'Vierhoeken (vierkant, rechthoek, ruit, parallellogram en trapezium)',
		'Diagonalen',
		'Driehoeken',
		'Symmetrie',
		'Gelijkheid van vorm én van grootte',
		'Schaduwbeelden',
		'Kijklijnen of viseerlijnen',
		'Patronen'
	],
	toepassingen:[
		'Werkwijze (heuristiek)',
		'Voorbeelden'
	]};

	useEffect(()=>{
		if (newExOption !== '' || exerciseType !== '' ) {
			setWasCreatingExercise(true);
		}
	// eslint-disable-next-line
	}, [])

	const handleWasCreatingAction = (action) =>{
		if (action) {
			setWasCreatingExercise(false);
			setexerciseSubType(localStorage.getItem('exerciseSubType'));
		} else{
			localStorage.removeItem('newExOption');
			setNewExOption('');
			localStorage.removeItem('exerciseType');
			setExerciseType('');
			localStorage.removeItem('exerciseSubType');
			setexerciseSubType('');
			localStorage.removeItem('newExerciseTitle');
			setTitle('');
			localStorage.removeItem('newExerciseDescription');
			setDescription('');
			localStorage.removeItem('newExerciseDueDate');
			setDueDate('');
			localStorage.removeItem('completedExerciseGeneral');
			setCompletedExerciseGeneral(false);
			localStorage.removeItem('amountAfter');
			setAmountAfter('');
			localStorage.removeItem('amountBefore');
			setAmountBefore('');
			localStorage.removeItem('minScore');
			setMinScore('');
			localStorage.removeItem('maxScore');
			setMaxScore('');
			localStorage.removeItem('completedExerciseDif');
			setCompletedExerciseDif(false);
			setWasCreatingExercise(false);
		}
	}

	const handleAddExercise = async () =>{
		await addExerciseToClass(selectedExercise, dueDate);
		localStorage.removeItem('newExOption');
		localStorage.removeItem('exerciseType');
		localStorage.removeItem('exerciseSubType');
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
	<>
		<div className='createExPage-container page--content' {...handlers}>
			{wasCreatingExercise? 
			<>
				<div className='page--heading'>
					<Title text='Verdergaan?'/>
					<Button text='terug' type='primary' onClick={()=> {history.goBack()}}/>
				</div>
			<div className='createExPage--wasCreating'>
				<div className='createExPage--wasCreating__heading'>
					U was een {newExOption === 'create'?'nieuwe oefening aan het maken':'oefening aan het kiezen uit de database '}
					{exerciseType!=='' ? <> met als onderwerp: <b>{exerciseType.split('_').join(' ')}</b>.</> : '.'}<br />
					{exerciseSubType!=='' ? <>en als type: <b>{exerciseSubType.split('-').join(' ')}</b>. <br /></> : ""}
					Wenst u verder te gaan met deze oefening?
				</div>
				<div className='createExPage--wasCreating__actions'>
					<Button text='Ja' type='primary' onClick={()=>{handleWasCreatingAction(true)}}/>
					<Button text='Nee' type='secondary' onClick={()=>{handleWasCreatingAction(false)}}/>
				</div>
			</div>
			</>
			:
			<>

				{
				newExOption === ''?
				<>
					<div className='page--heading'>
						<Title text='Nieuwe oefening'/>
						<Button text='terug' type='primary' onClick={()=> {history.goBack()}}/>
					</div>
					<div className='createExPage--options'>
						<NewExOptionCard title={'Nieuwe oefening maken'} text={'Wanneer u voor deze optie kiest kan u zelf uw oefening samen-stellen op basis van parameters.'} icon={<IoMdCreate />} onClick={()=>{ localStorage.setItem('newExOption', 'create'); setNewExOption('create');}}/>
						<NewExOptionCard title={'Oefening kiezen'} text={'Wanneer u voor deze optie kiest kan u kiezen uit een lange lijst oefeningen die reeds door andere leerkrachten gemaakt werden op wizzer.'} icon={<IoSearch />} onClick={()=>{localStorage.setItem('newExOption', 'choose');setNewExOption('choose')}}/>
					</div>
				</>
				:
				newExOption === 'create'?
				<>
					{completedExerciseGeneral === false?
					<>
						<>
						<div className='page--heading'>
							<Title text='Oefening maken'/>
						</div>
						<div className="CreateExercise--card">
							<div className='CreateExercise--card__title'>Algemeen</div>
							<div className='CreateExercise--card__gensetting'> <div>Titel</div> <input type='text' value={title} onChange={(ev)=>{ setTitle(ev.target.value);}}/> </div>
							<div className='CreateExercise--card__gensetting'> <div>Beschrijving</div> <input type='text' value={description}  onChange={(ev)=>{ setDescription(ev.target.value);}}/> </div>
							<div className='CreateExercise--card__gensetting'> <div>Indienen tot en met</div> <input type='date' defaultValue={new Date().toISOString().slice(0,10)} onChange={(ev)=>{setDueDate(ev.target.value)}}/> </div>

							{false && <Input label='Video url' text={videoUrl} textChange={setVideoUrl} extraClasses='CreateExercise--card__input'/>}
						</div>
						<div className='CreateExercise--actions'>
							<Button text='Annuleren' type='secondary' onClick={()=>{localStorage.removeItem('newExOption'); setNewExOption('');}}/>
							<Button text='Volgende' type='primary' onClick={()=>{if(title !== '' && description !== ''){localStorage.setItem('newExerciseTitle', title); localStorage.setItem('newExerciseDescription', description); localStorage.setItem('newExerciseDueDate', dueDate); localStorage.setItem('completedExerciseGeneral', true); setCompletedExerciseGeneral(true)}}}/>
						</div>
						</>
					</>
					:
					<>
					{completedExerciseDif === false || completedExerciseDif === 'false'?
					<>
						<div className='page--heading'>
							<Title text='Oefening maken'/>
						</div>
						<div className="CreateExercise--card">
							<div className='CreateExercise--card__title'>Differentiëren</div>
							<div className='CreateExercise--card__difsetting'> <div>Aantal voor differentiëren</div> <input type='number' placeholder={5} value={amountBefore} onChange={(ev)=>{ console.log(ev.target.value); setAmountBefore(parseInt(ev.target.value));}}/> </div>
							<div className='CreateExercise--card__difsetting'> <div>Aantal na differentiëren</div> <input type='number' placeholder={5} value={amountAfter} onChange={(ev)=>{ setAmountAfter(parseInt(ev.target.value));}}/> </div>
							<div className='CreateExercise--card__difsetting'> <div>Overschakelen naar lager niveau tot</div> <input type='text' placeholder={2} value={maxScore}  onChange={(ev)=>{ setMaxScore(ev.target.value );}}/> </div>
							<div className='CreateExercise--card__difsetting'> <div>Overschakelen naar hoger niveau vanaf</div> <input type='text'  placeholder={4} value={minScore}  onChange={(ev)=>{ setMinScore(ev.target.value );}}/></div>
							{false && <Input label='Video url' text={videoUrl} textChange={setVideoUrl} extraClasses='CreateExercise--card__input'/>}
						</div>
						<div className='CreateExercise--actions'>
							<Button text='Annuleren' type='secondary' onClick={()=>{localStorage.removeItem('newExerciseTitle'); localStorage.removeItem('newExerciseDescription'); localStorage.removeItem('newExerciseDueDate'); setCompletedExerciseGeneral(false)}}/>
							<Button text='Volgende' type='primary' onClick={()=>{if(amountBefore !== '' && amountAfter !== '' && maxScore !== '' && minScore !== ''){
								localStorage.setItem('amountBefore', amountBefore);
								localStorage.setItem('amountAfter', amountAfter);
								localStorage.setItem('maxScore', maxScore);
								localStorage.setItem('minScore', minScore);
								localStorage.setItem('completedExerciseDif', true);
								setCompletedExerciseDif(true);
							}}}/>
						</div>
					</>
					:
					<>
					{exerciseType === ''?
					<>
						<div className='page--heading'>
							<Title text='Oefening maken'/>
							<Button text='terug' type='primary' onClick={()=>{
								localStorage.setItem('completedExerciseDif', false);
								localStorage.removeItem('amountBefore', amountBefore);
								localStorage.removeItem('amountAfter', amountAfter);
								localStorage.removeItem('maxScore', maxScore);
								localStorage.removeItem('minScore', minScore);
								setCompletedExerciseDif(false);}}/>
						</div>
						<ExerciseSubjectSelector onClick={setExerciseType} />
						<div className='page--heading'>
							<Button text='terug' type='primary' onClick={()=>{
								localStorage.setItem('completedExerciseDif', false);
								localStorage.removeItem('amountBefore', amountBefore);
								localStorage.removeItem('amountAfter', amountAfter);
								localStorage.removeItem('maxScore', maxScore);
								localStorage.removeItem('minScore', minScore);
								setCompletedExerciseDif(false);
								}
							}/>
						</div>
					</>
					:
					<>
					{!exerciseSubType || exerciseSubType === ''?
					<>
						<div className='page--heading'>
							<Title text='Oefening maken'/>
							<Button text='terug' type='primary' onClick={()=>{localStorage.removeItem('exerciseType'); setExerciseType('');}}/>
						</div>
						Kies een type oefening.
						{exerciseType && exerciseTypes[exerciseType].map((type, i)=>{
							return <div className='exerciseTypeCard' key={i} onClick={()=>{localStorage.setItem('exerciseSubType', type.toLowerCase().split(' ').join('-')); setexerciseSubType(type.toLowerCase().split(' ').join('-')); history.push(Routes.CREATE_EXERCISE_DETAIL.replace(':type', type.toLowerCase().split(' ').join('-')))}}>{type}</div>;
						})}
						<div className='page--heading'>
							<Button text='terug' type='primary' onClick={()=>{localStorage.removeItem('exerciseType'); setExerciseType('');}}/>
						</div>
					</>
					:
					<>
						{history.push(Routes.CREATE_EXERCISE_DETAIL.replace(':type', exerciseSubType))}
					</>
					}
					</>
					}
					</>
					}
					</>
					}
				</>
				:
				<>
					<div className='page--heading'>
						<Title text='Oefening kiezen'/>
						<Button text='terug' type='primary' onClick={()=> {history.goBack()}}/>
					</div>
					{exerciseType === ''?
					<>
						<ExerciseSubjectSelector onClick={setExerciseType} />
						<Button text='annuleren' type='primary' onClick={()=>{localStorage.removeItem('newExOption'); setNewExOption('')}}/>
					</>
					:
					<>
					{!exerciseSubType || exerciseSubType === ''?
					<>
						Kies een type oefening.
						{exerciseType && exerciseTypes[exerciseType].map((type, i)=>{
							return <div className='exerciseTypeCard' key={i} onClick={()=>{localStorage.setItem('exerciseSubType', type.toLowerCase().split(' ').join('-')); setexerciseSubType(type.toLowerCase().split(' ').join('-'))}}>{type}</div>;
						})}
						<Button text='annuleren' type='primary' onClick={()=>{localStorage.removeItem('exerciseType'); setExerciseType('')}}/>
					</>
					:
					<>
						{selectedExercise === ''?
						<>
							{dataForSubType && dataForSubType.length>0 ? dataForSubType.map((ex, i)=>{
								return <div className='exerciseTypeCard' key={i} onClick={()=>{setSelectedExercise(ex.id)}} /*onClick={()=>{handleAddExercise(ex.id)}}*/ >{ex.title} <br/><small><b>door: {ex.createdBy.firstname} {ex.createdBy.lastname}</b></small></div>
							}):
							'Er zijn geen oefeningen terug te vinden in de database voor deze soort oefening.'
							}
							<Button text='annuleren' type='primary' onClick={()=>{localStorage.removeItem('exerciseSubType'); setexerciseSubType('')}}/>
						</>
						:
						<div className="createExercise--lastStep">
							<div className="createExercise--lastStep__content">
								<ExerciseDetail id={selectedExercise}/>
								<div className="CreateExercise--card">
									<div className='CreateExercise--card__title'>
										Laatste details
									</div>
									<div className='CreateExercise--card__gensetting'> <div>Indienen tot en met</div> <input type='date' defaultValue={new Date().toISOString().slice(0,10)} onChange={(ev)=>{setDueDate(ev.target.value)}}/> </div>
								</div>
							</div>

							<div className='FillInExercisePage--container__actions'>
								<Button text='annuleren' type='secondary' onClick={()=>{localStorage.removeItem('exerciseSubType'); setexerciseSubType('')}}/>
								<Button text='toevoegen' type='primary' onClick={()=>{handleAddExercise()}}/>
							</div>
						</div>
						}
					</>

					}
					</>
					}
				</>
				}
			</>
			}
		</div>
		<NavBar active={'exercises'}/>
	</>
  );
};

export default CreateExercisePage;