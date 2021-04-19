import { default as React } from 'react';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';
import {FaUser, FaSchool, FaBook} from 'react-icons/fa'
import Logo from '../../_static/icons/nobglogo.png';

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
		<>
			<nav className="mobilenav">
				<div onClick={()=>{handleClick('class')}} className={active === 'class'? 'active':''}><FaSchool /></div>
				<div onClick={()=>{handleClick('exercises')}} className={active === 'exercises'? 'active': ''}><FaBook /></div>
				<div onClick={()=>{handleClick('profile')}} className={active === 'profile'? 'active': ''}><FaUser /></div>
			</nav>
			<nav className="webnav">
				<div className="webnav--container">
					<img src={Logo} alt='wizzer'/>
					<div onClick={()=>{handleClick('class')}} className={active === 'class'? 'webnav active':'webnav'}><FaSchool /> <div>Klasgroep</div></div>
					<div onClick={()=>{handleClick('exercises')}} className={active === 'exercises'? 'webnav active': 'webnav'}><FaBook /><div>Oefeningen</div></div>
					<div onClick={()=>{handleClick('profile')}} className={active === 'profile'? 'webnav active': 'webnav'}><FaUser /><div>Profiel</div></div>
				</div>
			</nav>
		</>
	);
};

export default NavBar;