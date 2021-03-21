import { default as React, Fragment, useCallback, useState} from 'react';
import { Link } from 'react-router-dom';
import * as Routes from '../routes';
import { useAuth } from '../services';
import { Route, useHistory } from 'react-router';
import { NavBar, NewExOptionCard, Title } from '../components';
import {IoMdCreate} from 'react-icons/io'
import { IoSearch } from 'react-icons/io5';


const CreateExercisePage = () => {
	const [newExOption, setNewExOption] = useState('');

	const history = useHistory();
	const { signIn, currentUser } = useAuth();

	const handleHome = (tabToShow) =>{
		sessionStorage.setItem('HomeTab', tabToShow);
		history.push(Routes.HOME);
	}

  return (
	<>
		<div className='createExPage-container'>
			<div className='createExPage--heading'>
				<Title text='Nieuwe oefening'/>
			</div>
			{newExOption === ''?
			<>
				<div className='createExPage--options'>
					<NewExOptionCard title={'Nieuwe oefening maken'} text={'Wanneer u voor deze optie kiest kan u zelf uw oefening samen-stellen op basis van parameters.'} icon={<IoMdCreate />} onClick={()=>{setNewExOption('create')}}/>
					<NewExOptionCard title={'Oefening kiezen'} text={'Wanneer u voor deze optie kiest kan u kiezen uit een lange lijst oefeningen die reeds door andere leerkrachten gemaakt werden op wizzer.'} icon={<IoSearch />} onClick={()=>{setNewExOption('choose')}}/>
				</div>
			</>
			:
			newExOption === 'create'?
			'Create'
			:
			'Choose'
			}
		</div>
		<NavBar active={'exercises'} extraOnClick={(tab)=> {handleHome(tab)}}/>
	</>
  );
};

export default CreateExercisePage;