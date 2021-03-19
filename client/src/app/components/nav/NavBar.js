import { default as React } from 'react';

import { ReactComponent as School }from '../../_static/icons/school-solid.svg';
import { ReactComponent as Exercise }from '../../_static/icons/book-solid.svg';

const NavBar = ({active, setActive}) => {

	const handleClick = (name) =>{
		setActive(name);
	}

  return (
	<nav>
		<div onClick={()=>{handleClick('class')}} className={active === 'class'? 'active':''}><School /></div>
		<div onClick={()=>{handleClick('exercises')}} className={active === 'exercises'? 'active': ''}><Exercise /></div>
	</nav>
  );
};

export default NavBar;