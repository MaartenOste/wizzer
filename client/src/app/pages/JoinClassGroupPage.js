import { default as React, Fragment, useCallback, useEffect, useState} from 'react';
import { useParams } from 'react-router';
import { useApi, useAuth } from '../services';
import * as Routes from '../routes';
import { useHistory } from 'react-router';
import { Button, Input } from '../components';

import img from '../_static/icons/nobglogo.png'

const JoinClassGroupPage = () => {
	const { joinClassRoom } = useApi();
	const {currentUser} = useAuth();
	const { id } = useParams();

	const updateClass = useCallback(() => {
		const updateUserClassId = async () => {
				try {
					await joinClassRoom(id);
				} catch (error) {
					console.error(error.message)
				}
			}
		updateUserClassId();
	},[id, joinClassRoom]);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorPopup, setErrorPopup] = useState(false);

	const history = useHistory();
	const { signIn } = useAuth();

	const handleLogin = async () =>{
		const resp = await signIn(username, password);
		console.log(resp);
		if (resp.error) {
			setErrorPopup(resp.error);
		} else {
			history.push(Routes.CLASSGROUP);
		}
	}

	useEffect(()=>{
		if (currentUser) {
			updateClass();
			history.push(Routes.CLASSGROUP);
		}
	}, [currentUser, updateClass, history])

  return (
    <Fragment>
      <div className='joinClassGroupPage-container'>
		  {currentUser ?
		''
		:
		<div className='login-container'>
		{console.log(currentUser)}
			<div className='login-logo'>
				<img src={img} alt='Wizzer'></img>
			</div>
			<div className='login-form'>
				<Input label={'Gebruikersnaam'} text={username} textChange={setUsername}/>
				<Input label={'Wachtwoord'} text={password} textChange={setPassword} type={'password'}/>
				{errorPopup && <div className='errorpopup'>{errorPopup}</div>}
				<Button text={'Aanmelden'} type={'primary'} onClick={handleLogin}/>
			</div>
		</div>
		}
	</div>
    </Fragment>
  );
};

export default JoinClassGroupPage;