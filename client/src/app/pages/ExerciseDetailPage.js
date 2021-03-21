import { default as React, Fragment, useCallback, useState} from 'react';
import { Link } from 'react-router-dom';
import * as Routes from '../routes';
import { useAuth } from '../services';
import { useHistory } from 'react-router';
import { Button, Footer, Input } from '../components';

const ExerciseDetailPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const history = useHistory();
	const { signIn, currentUser } = useAuth();

	const handleLogin = async () =>{
		console.log('log in');
	}

  return (
    <Fragment>
      yeet
    </Fragment>
  );
};

export default ExerciseDetailPage;