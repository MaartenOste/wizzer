import { default as React, Fragment, useEffect, useCallback } from 'react';
import * as Routes from '../routes';
import { useAuth, useApi } from '../services';
import { useHistory } from 'react-router';
import {  useParams } from 'react-router-dom';

const LoginRedirectPage = () => {
	const {id} = useParams();
	const history = useHistory();
	const { setCurrentUser, setCookie } = useAuth();
	const { getUserById, joinClassRoom } = useApi();

	
	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			try {
				let user = await getUserById(id);
				setCurrentUser(user);
				setCookie('wizzerUser', JSON.stringify(user));
				if (sessionStorage.getItem('joinClassId')) {
					await joinClassRoom(sessionStorage.getItem('joinClassId'), id);
				}
				history.push(
					Routes.CLASSGROUP
				)
			} catch (error) {
				history.push(Routes.LOGIN);
			}
		}
		fetchdata();
		// eslint-disable-next-line
	},[]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);


  return (
    <Fragment>
    </Fragment>
  );
};

export default LoginRedirectPage;