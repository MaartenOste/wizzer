import { default as React, Fragment, useCallback, useEffect, useState} from 'react';
import * as Routes from '../routes';
import { useApi, useAuth } from '../services';
import { useHistory } from 'react-router';
import { Button, Title, Stage, StudentCard, NavBar } from '../components';
import {useSwipeable} from 'react-swipeable';

const ClassPage = () => {
	const history = useHistory();
	const {currentUser} = useAuth();
	const [students, setStudents] = useState();
	const [classId, setClassId] = useState();

	const [topThree, setTopThree] = useState();

	const { getClassFromUser, getTopThree } = useApi();
	const [hasClass, setHasClass] = useState(null);

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
				try {
					let data = await getClassFromUser();
					setClassId(data.id);
					setStudents(data.students.sort((a,b)=>{return (''+ a.lastname).localeCompare(b.lastname)}));
					setHasClass(true);
					console.log(data);
					if(currentUser.userType === 'Student'){
						let topthree = await getTopThree(data.id);
						setTopThree(topthree);
					}
				} catch (error) {
					setHasClass(false);
				}
		}
		fetchdata();
	},[ getClassFromUser, getTopThree, currentUser]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

	const copyJoinLink = () => {
		let input = document.createElement("input");
		document.body.insertBefore(input, document.body.firstChild);
		input.value = `http://localhost:3000/join/${classId}`;
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
		onSwipedLeft: (ev)=>{handleSwipeMenu(ev.deltaX)},
	});

	useEffect(()=>{
		if (sessionStorage.getItem('joinClassId')) {
			sessionStorage.removeItem('joinClassId')
		}
		setStudents()
	}, [])

  return (
    <Fragment>
		<div className='homePage-container page--content' {...handlers}>
			<div className='class--container'>
				{hasClass !== null ?
				<>
					<div className='homePage--heading'>
						<Title text='Klasgroep'/>
						{currentUser.userType === 'Teacher' && <Button text='uitnodigen' type='invite' onClick={()=> {copyJoinLink()}}/>}
					</div>
					{hasClass?
						<>
							{currentUser.userType === 'Teacher'?
								<>
									{students && students.map((student, i) => {
										return <StudentCard id={student.id} name={`${student.firstname} ${student.lastname}`} key={i}/>
									})}
								</>
								:<>{topThree &&<Stage first={topThree[0][0]} second={topThree[1][0]} thrid={topThree[2][0]}/>}</>
							}
						</>
						:<>
							{currentUser.userType === 'Student' ? 'Je ziet nog niet in een klas, klik op de link die je leerkracht je stuurde om bij een klas aan te sluiten':'maak een klas'}
						</>
					}
				</>
				:'Laden'}
			</div>
		</div>
		<NavBar active={'class'}/>
    </Fragment>
  );
};

export default ClassPage;