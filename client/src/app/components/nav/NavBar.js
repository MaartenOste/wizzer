import { default as React } from 'react';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';
import {FaUser, FaSchool, FaBook} from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io'
import Logo from '../../_static/icons/nobglogo.png';
import { useAuth } from '../../services';
import {Button} from '../';

const NavBar = ({ active }) => {
	const history = useHistory();
	const { logout } = useAuth();

	const handleClick = (name) =>{
		switch (name) {
			case 'class':
				history.push(Routes.CLASSGROUP);
				break;
			case 'exercises':
				history.push(Routes.EXERCISE);
				break;
			case 'profile':
				history.push(Routes.SETTINGS);
				break;
			default:
				break;
		}
	}

	const handleLogout = async () =>{
		await logout();
		history.push(Routes.LOGIN)
	}

	return (
		<>
			<nav className="mobilenav">
				<div onClick={()=>{handleClick('class')}} className={active === 'class'? 'active':''}><FaSchool /></div>
				<div onClick={()=>{handleClick('exercises')}} className={active === 'exercises'? 'active': ''}><FaBook /></div>
				<div onClick={()=>{handleClick('profile')}} className={active === 'profile'? 'active': ''}><FaUser /></div>
			</nav>
			<nav className="webnav">
				<div className="webnav--container">
					<img src={Logo} alt='wizzer'/>
					<a href={Routes.CLASSGROUP}  className={active === 'class'? 'webnav active':'webnav'}><FaSchool /> <div>Klasgroep</div></a>
					<a href={Routes.EXERCISE} className={active === 'exercises'? 'webnav active': 'webnav'}><FaBook /><div>Oefeningen</div></a>
					<Button text={<><IoIosLogOut />Afmelden</>} extraClasses='nav-logout' type='primary' onClick={()=>{handleLogout()}}/>
				</div>
			</nav>
		</>
	);
};

export default NavBar;