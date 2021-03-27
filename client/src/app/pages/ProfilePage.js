import { default as React, Fragment } from 'react';
import { NavBar, Button, Title } from '../components';
import { useHistory } from 'react-router-dom'
import * as Routes from '../routes';


const ProfilePage = () => {
	const history = useHistory();

  return (
    <Fragment>
		<div className='homePage-container'>
			<Title text='instellingen'/>
			<Button text='afmelden' type='primary' onClick={()=>{history.push(Routes.LOGIN)}}/>
		</div>
		<NavBar active={'profile'}/>
    </Fragment>
  );
};

export default ProfilePage;