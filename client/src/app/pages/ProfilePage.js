import { default as React, Fragment } from 'react';
import { NavBar, Button, Title } from '../components';
import { useHistory } from 'react-router-dom'
import * as Routes from '../routes';
import {useSwipeable} from 'react-swipeable';
import { useAuth } from '../services';

const ProfilePage = () => {
	const history = useHistory();
	const { logout } = useAuth();

	const handleSwipeMenu = (deltaX) =>{
		if (deltaX >= 50) {
			history.push(Routes.EXERCISE);
		} 
	}

	const handlers = useSwipeable({
		onSwipedRight: (ev)=>{handleSwipeMenu(ev.deltaX)},
	});

	const handleLogout = async () =>{
		await logout();
		history.push(Routes.LOGIN)
	}

  return (
	<Fragment>
		<div className='page--content' {...handlers}>
			<div className='page--heading'>
				<Title text='Instellingen'/>
			</div>
			<Button text='afmelden' type='primary' onClick={()=>{handleLogout()}}/>
		</div>
		<NavBar active={'profile'}/>
	</Fragment>
  );
};

export default ProfilePage;