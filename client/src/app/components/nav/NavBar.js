import { default as React } from 'react';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';
import { ReactComponent as School }from '../../_static/icons/school-solid.svg';
import { ReactComponent as Exercise }from '../../_static/icons/book-solid.svg';

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
			default:
				break;
		}
	}

	return (
		<nav>
			<div onClick={()=>{handleClick('class')}} className={active === 'class'? 'active':''}><School /></div>
			<div onClick={()=>{handleClick('exercises')}} className={active === 'exercises'? 'active': ''}><Exercise /></div>
		</nav>
	);
};

export default NavBar;