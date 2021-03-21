import { default as React, Fragment, useState} from 'react';
import * as Routes from '../routes';
import { useAuth } from '../services';
import { useHistory } from 'react-router';
import { Button, Footer, Input } from '../components';

const LoginPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorPopup, setErrorPopup] = useState(false);

	const history = useHistory();
	const { signIn, currentUser } = useAuth();

	const handleLogin = async () =>{
		const resp = await signIn(username, password);
		console.log(resp);
		if (resp.error) {
			setErrorPopup(resp.error);
		} else {
			sessionStorage.setItem('user', JSON.stringify(resp));
			history.push(Routes.CLASSGROUP);
		}
	}

  return (
    <Fragment>
		<div className='login-container'>
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