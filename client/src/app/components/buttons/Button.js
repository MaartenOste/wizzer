import { default as React } from 'react';

const Button = ({text, type, onClick= () => {}}) => {
  return (
    <button className={`button--${type}`} onClick={()=> {onClick()}}>
		  {text}
	  </button>
  );
};

export default Button;