// import { default as React, useCallback, Fragment } from 'react';
// import { Link } from 'react-router-dom';
// import * as Routes from '../routes';
// import { useAuth } from '../services';
// import { useHistory } from 'react-router';
// import { Button, Footer } from '../components';
// import '../_sass/pages/Register.scss';

// const Registerpage = (props) => {
// 	const history = useHistory();
// 	const { signIn, registerUser } = useAuth();

// 	const handleRegister = async () =>{
// 		console.log('in register');
// 		const email = document.getElementById('email').value;
// 		const password = document.getElementById('password').value;
// 		const passwordrepeat = document.getElementById('passwordrepeat').value;
// 		const resp = await registerUser(email, password, passwordrepeat);
// 		console.log('in registerpage');
// 		console.log(resp);
		
// 		if(resp.status === 200){
// 			console.log('in redirect');
// 			await signIn(email, password);
// 			history.push(Routes.CAMERA);
// 		}
		
// 	}

//   return (
//     <Fragment>
// 		<div className='register-container'>
// 			<Link to={Routes.LOGIN}>
// 				<i className="fas fa-arrow-left returnbutton"></i>
// 			</Link>
// 		<div className='register-form'>
// 			<div className='register-item'>
// 				<div className='register-label'>
// 					@
// 				</div>
// 				<input type='text' className='register-input' placeholder='email@email.com' id='email'></input>
// 			</div>
// 			<div className='register-item'>
// 				<div className='register-label'>
// 				<i className="fas fa-lock"></i>
// 				</div>
// 				<input type='password' className='register-input' placeholder='Password' id='password'></input>
// 			</div>
// 			<div className='register-item'>
// 				<div className='register-label'>
// 				<i className="fas fa-lock"></i>
// 				</div>
// 				<input type='password' className='register-input' placeholder='Repeat password' id='passwordrepeat'></input>
// 			</div>
// 			<div onClick={(ev) => handleRegister()}>
// 				<Button title={'Register'} bgcolor={'#FCA311'} txtcolor={'white'}/>
// 			</div>
// 		</div>
// 		</div>
// 		<Footer/>
//     </Fragment>
//   );
// };

// export default Registerpage;