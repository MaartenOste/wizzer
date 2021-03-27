
import { default as React } from 'react';

const Input = ({label, text, textChange, id, type='text'}) => {
  return (
	<div className={`input--wrapper ${text && 'valueAdded'}`}>
		<input type={type} className='input'  value={text} onChange={(e)=>{textChange(e.target.value)}} id={id}></input>
		<span className='input--label'>
			{label}
		</span>
	</div>
  );
};

export default Input;