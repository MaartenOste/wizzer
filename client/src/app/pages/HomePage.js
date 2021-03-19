import { default as React, Fragment, useCallback, useState} from 'react';
import { Link } from 'react-router-dom';
import * as Routes from '../routes';
import { useAuth } from '../services';
import { useHistory } from 'react-router';
import { Button, ExerciseCard, Filter, NavBar, StudentCard, Title } from '../components';
import {useSwipeable} from 'react-swipeable';


const HomePage = () => {
	const history = useHistory();
	const { signIn, currentUser } = useAuth();

	const [tabToShow, setTabToShow] = useState('class');

	const [students, setStudents] = useState([{id: '205a1aze0r419azr1505a1zera05451041105160e', name: 'Senne Wancour', type: 'student'},{id: '2051aze0r4azerraa19azr1505a1zera0a5451041105160e', name: 'Laure De Norre', type: 'student'}, {id: '2051aze0r4a19azr1505a1zera0a5451041105160e', name: 'Arno Hernou', type: 'student'}, {id: '2051aze0ar419azr1505a1zera0aa5451041105160e', name: 'Jef Vermeire', type: 'student'}, {id: '2051aze0r419azar1505a1zera05451041105a160e', name: 'Wouter Janssens', type: 'student'}, {id: '2051aaze0raa419azar1a505a1zera0545aezr1041105araa160e', name: 'Maarten Oste', type: 'student'}]);
	const [exercises, setExercises] = useState([{id: '2051aze0r4z19azr1505a1zera05451041105160e', name: 'oef1', type: 'Getallenkennis'},{id: '2051aze0r419azr1505a1zera0a5451041105160e', name: 'oef2', type: 'Bewerkingen'}, {id: '2051aze0zr419azr1505aa1zera05451041105160e', name: 'oef3', type: 'Meetkunde'}, {id: '2051aze0r4ra19azr1505a1zera05451041105160e', name: 'oef4', type: 'Meten en metend rekenen'}, {id: '2051azee0r419azr1505a1zera05451041105160e', name: 'oef5', type: 'Toepassingen'}, {id: '20z4751aze0r4z1a9azr1505a174zera0545104110567160e', name: 'oef6', type: 'Getallenkennis'}]);

	const handleMenu = (name) =>{
		setTabToShow(name);
	}

	const handleSwipeMenu = (deltaX, name) =>{
		if (Math.abs(deltaX) >= 50) {
			setTabToShow(name);
		}
	}

	const handlers = useSwipeable({
		onSwipedLeft: (ev)=>{handleSwipeMenu(ev.deltaX, 'exercises')},
		onSwipedRight: (ev)=>{handleSwipeMenu(ev.deltaX, 'class')}
	});

	const copyJoinLink = () => {
		/* Get the text field */
		let copyText = document.getElementById("classIdInput");
	  
		/* Select the text field */
		copyText.select();
		copyText.setSelectionRange(0, 99999); /* For mobile devices */
	  
		/* Copy the text inside the text field */
		document.execCommand("copy");
	  
		/* Alert the copied text */
		console.log("Copied the text: " + copyText.value);
	  }

  return (
	<Fragment>
		<div className='homePage-container' {...handlers}>
			<input style={{display:'none'}} readOnly={true} value={'https://wizzer.be/join/classid'} id='classIdInput' ></input>

			{tabToShow === 'class'?
			<>
				<div className='homePage--heading'>
					<Title text='Klasgroep'/>
					<Button text='uitnodigen' type='invite' onClick={()=> {copyJoinLink()}}/>
				</div>
				{students.map((student, i) => {
					return <StudentCard id={student.id} name={student.name} key={i}/>
				})}
			</>
			:
			<>
				<div className='homePage--heading'>
					<Title text='Oefeningen'/>
				</div>
				<Filter />
				{exercises.map((ex, i) => {
					return <ExerciseCard id={ex.id} name={ex.name} key={i}/>
				})}
			</>
			}
		</div>
		<NavBar active={tabToShow} setActive={handleMenu}/>
	</Fragment>
  );
};

export default HomePage;