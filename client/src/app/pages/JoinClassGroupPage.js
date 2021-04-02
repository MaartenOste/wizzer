import { default as React, Fragment, useCallback, useEffect} from 'react';
import { useParams } from 'react-router';
import { useApi, useAuth } from '../services';
import * as Routes from '../routes';
import { useHistory } from 'react-router';
import { Button } from '../components';

import img from '../_static/icons/nobglogo.png'

const JoinClassGroupPage = () => {
	const { joinClassRoom } = useApi();
	const {currentUser, signIn} = useAuth();
	const { id } = useParams();
	const history = useHistory();

	const updateClass = useCallback(() => {
		const updateUserClassId = async () => {
				try {
					await joinClassRoom(id);
					history.push(Routes.CLASSGROUP);
				} catch (error) {
					console.error(error.message)
				}
			}
		updateUserClassId();
	},[id, joinClassRoom, history]);

	const handleLogin = async () => {
		await signIn();
	}

	useEffect(()=>{
		sessionStorage.setItem('joinClassId', id);
		if (currentUser) {
			updateClass();
		}
	}, [currentUser, updateClass, history, id])

  return (
    <Fragment>
      <div className='joinClassGroupPage-container'>
		{currentUser ?
		''
		:
		<div className='login-container'>
			<div className='login-logo'>
				<img src={img} alt='Wizzer'></img>
			</div>
			<div className='login-form'>
				<Button text={'Aanmelden met smartschool'} type={'primary'} onClick={handleLogin}/>
			</div>
		</div>
		}
	</div>
    </Fragment>
  );
};

export default JoinClassGroupPage;