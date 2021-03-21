import { default as React, Fragment, useCallback, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import * as Routes from '../routes';
import { useApi } from '../services';
import { useHistory } from 'react-router';
import { Button, Title, StudentCard, NavBar } from '../components';
import {useSwipeable} from 'react-swipeable';

const ClassPage = () => {
	const history = useHistory();
	const [students, setStudents] = useState();
	const { getStudents } = useApi();

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			let data = await getStudents();
			setStudents(data);
		}
		fetchdata();
	},[]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

	const copyJoinLink = () => {
		var input = document.body.appendChild(document.createElement("input"));
		input.value = 'https://wizzer.be/join/classid';
		input.focus();
		input.select();
		document.execCommand('copy');
		input.parentNode.removeChild(input);
	}

	const handleSwipeMenu = (deltaX) =>{
		if (deltaX <= -50) {
			history.push(Routes.EXERCISE);
		}
	}

	const handlers = useSwipeable({
		onSwipedLeft: (ev)=>{handleSwipeMenu(ev.deltaX, 'exercises')},
		onSwipedRight: (ev)=>{handleSwipeMenu(ev.deltaX, 'class')}
	});

	useEffect(()=>{
		setStudents()
	}, [])

  return (
    <Fragment>
		<div className='homePage-container' {...handlers}>
			<div className='class--container'>
				<div className='homePage--heading'>
						<Title text='Klasgroep'/>
						<Button text='uitnodigen' type='invite' onClick={()=> {copyJoinLink()}}/>
					</div>
					{students && students.map((student, i) => {
						return <StudentCard id={student.id} name={student.name} key={i}/>
				})}
			</div>
		</div>
		<NavBar active={'class'}/>
    </Fragment>
  );
};

export default ClassPage;