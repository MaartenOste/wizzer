import { default as React, Fragment, useState} from 'react';
import * as Routes from '../routes';
import { useAuth } from '../services';
import { useHistory } from 'react-router';
import { Button, Input } from '../components';

import img from '../_static/icons/nobglogo.png'

const LoginPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorPopup, setErrorPopup] = useState(false);

	const history = useHistory();
	const { signIn } = useAuth();

	const handleLogin = async () =>{
		const resp = await signIn(username, password);
		/*if (resp.error) {
			setErrorPopup(resp.error);
		} else {
			history.push(Routes.CLASSGROUP);
		}*/
	}

  return (
    <Fragment>
		<div className='login-container'>
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
    </Fragment>
  );
};

export default LoginPage;