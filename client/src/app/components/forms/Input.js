
import { default as React } from 'react';

const Input = ({label, text, textChange, id, type='text', extraClasses=''}) => {
  return (
	<div className={`input--wrapper ${text && 'valueAdded'} ${extraClasses}`}>
		<input type={type} className='input'  value={text} onChange={(e)=>{textChange(e.target.value)}} id={id}></input>
		<span className='input--label'>
			{label}
		</span>
	</div>
  );
};

export default Input;