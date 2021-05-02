import { default as React, Fragment, useEffect, useState} from 'react';
//import * as Routes from '../routes';
import { useAuth } from '../services';
import { Button } from '../components';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import * as Routes from '../routes';
import img from '../_static/icons/nobglogo.png'

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const LoginPage = () => {
	let query = useQuery();
	const history = useHistory();
	const [errorPopup, setErrorPopup] = useState(false);

	const { signIn, currentUser } = useAuth();

	const handleLogin = async () =>{
		await signIn();
	}

	useEffect(()=>{
		if (currentUser) {
			history.push(Routes.CLASSGROUP);
		}
		if (query.get('failed') === 'true') {
			setErrorPopup('Inloggen mislukt, probeer opnieuw');
		}
	},[query, currentUser, history])

  return (
    <Fragment>
		<div className='login-container'>
			<div className='login-logo'>
				<img src={img} alt='Wizzer'></img>
			</div>
			<div className='login-form'>
				{errorPopup && <div className='errorpopup'>{errorPopup}</div>}
				<Button text={'Aanmelden met smartschool'} type={'primary'} onClick={handleLogin}/>
			</div>
			<div className="copyright">
				© Arteveldehogeschool, opleiding Grafische en digitale media 2021
			</div>
		</div>
    </Fragment>
  );
};

export default LoginPage;