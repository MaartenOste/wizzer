import { default as React, Fragment } from 'react';
import { Link } from 'react-router-dom';
import * as Routes from '../routes';

const ErrorPage = () => {

  return (
    <Fragment>
      <div className='classPage-container page--content'>
		error 404 page not found
		<Link to={Routes.LOGIN}>Klik hier om in te loggen</Link>
	  </div>
    </Fragment>
  );
};

export default ErrorPage;