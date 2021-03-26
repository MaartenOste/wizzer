import { default as React, Fragment, useState} from 'react';
import { Button, Footer, Input } from '../components';

const JoinClassGroupPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async () =>{
		console.log('log in');
	}

  return (
    <Fragment>
      <div className='joinClassGroupPage-container'>
		<div className='login-form'>
			<Input label={'Gebruikersnaam'} text={username} textChange={setUsername}/>
			<Input label={'Wachtwoord'} text={password} textChange={setPassword}/>
			<Button text={'Aanmelden'} type={'primary'} onClick={handleLogin}/>
		</div>
	</div>
	<Footer/>
    </Fragment>
  );
};

export default JoinClassGroupPage;