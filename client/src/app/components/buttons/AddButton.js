import { default as React } from 'react';
import {IoAddOutline} from 'react-icons/io5';

const Button = ({onClick= () => {}}) => {
  return (
    <div className={`button--add`} onClick={()=> {onClick()}}>
		<IoAddOutline />
	</div>
  );
};

export default Button;