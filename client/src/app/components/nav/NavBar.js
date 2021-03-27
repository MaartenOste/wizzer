import { default as React } from 'react';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';
import {FaUser, FaSchool, FaBook} from 'react-icons/fa'


const NavBar = ({ active }) => {
	const history = useHistory();

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

	return (
		<nav>
			<div onClick={()=>{handleClick('class')}} className={active === 'class'? 'active':''}><FaSchool /></div>
			<div onClick={()=>{handleClick('exercises')}} className={active === 'exercises'? 'active': ''}><FaBook /></div>
			<div onClick={()=>{handleClick('profile')}} className={active === 'profile'? 'active': ''}><FaUser /></div>
		</nav>
	);
};

export default NavBar;