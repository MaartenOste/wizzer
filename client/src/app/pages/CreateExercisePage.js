import { default as React, useEffect, useState} from 'react';
import { Button, ExersiseSubjectSelector, NavBar, NewExOptionCard, Title } from '../components';
import {IoMdCreate} from 'react-icons/io'
import { IoSearch } from 'react-icons/io5';


const CreateExercisePage = () => {
	const [newExOption, setNewExOption] = useState(localStorage.getItem('newExOption') || '');
	const [exersiseSubject, setExersiseSubject] = useState(localStorage.getItem('exersiseSubject') || '');
	const [wasCreatingExercise, setWasCreatingExercise] = useState(false);

	const exerciseTypes = {getallenkennis:['Getallen gebruiken om te zeggen hoeveel er zijn',
		'Getallen gebruiken in een rangorde',
		'Getallen gebruiken bij een maateenheid',
		'Getallen gebruiken in een bewerking',
		'Getallen gebruiken als code',
		'We geven de natuurlijke getallen tot 1000 een plaats op honderdvelden',
		'We geven de natuurlijke getallen tot 1000 een plaats op getallenassen',
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
		'Gewicht' ,
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
		'Voorbeelden '
	]};

	useEffect(()=>{
		if (newExOption !== '' || exersiseSubject !== '' ) {
			setWasCreatingExercise(true);
		}
	// eslint-disable-next-line
	}, [])

	const handleWasCreatingAction = (action) =>{
		if (action) {
			setWasCreatingExercise(false)
		} else{
			localStorage.removeItem('newExOption');
			setNewExOption('');
			localStorage.removeItem('exersiseSubject');
			setExersiseSubject('');
			setWasCreatingExercise(false)
		}
	}

  return (
	<>
		<div className='createExPage-container'>
			{wasCreatingExercise? 
			<>
			<div className='createExPage--heading'>
				<Title text='Verdergaan?'/>
			</div>
			<div className='createExPage--wasCreating'>
				<div className='createExPage--wasCreating__heading'>
					U was een {newExOption === 'create'?'nieuwe oefening aan het maken':'oefening aan het kiezen uit de database'}
					{exersiseSubject!=='' ? <>met als onderwerp: <b>{exersiseSubject.split('_').join(' ')}</b>.</> : '.'}<br />
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
				<div className='createExPage--heading'>
					<Title text='Nieuwe oefening'/>
				</div>
				{
				newExOption === ''?
				<>
					<div className='createExPage--options'>
						<NewExOptionCard title={'Nieuwe oefening maken'} text={'Wanneer u voor deze optie kiest kan u zelf uw oefening samen-stellen op basis van parameters.'} icon={<IoMdCreate />} onClick={()=>{ localStorage.setItem('newExOption', 'create'); setNewExOption('create');}}/>
						<NewExOptionCard title={'Oefening kiezen'} text={'Wanneer u voor deze optie kiest kan u kiezen uit een lange lijst oefeningen die reeds door andere leerkrachten gemaakt werden op wizzer.'} icon={<IoSearch />} onClick={()=>{localStorage.setItem('newExOption', 'choose');setNewExOption('choose')}}/>
					</div>
				</>
				:
				newExOption === 'create'?
				'Create'
				:
				<>
					{exersiseSubject === ''?
					<>{console.log(exersiseSubject)}
						<ExersiseSubjectSelector onClick={setExersiseSubject} />
						<Button text='annuleren' type='primary' onClick={()=>{localStorage.removeItem('newExOption'); setNewExOption('')}}/>
					</>
					:
					<>
						Kies een type oefening.
						{exerciseTypes[exersiseSubject].sort().map((type, i)=>{
							return <div className='exerciseTypeCard' key={i}>{type}</div>;
						})}
						<Button text='annuleren' type='primary' onClick={()=>{localStorage.removeItem('exersiseSubject'); setExersiseSubject('')}}/>
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