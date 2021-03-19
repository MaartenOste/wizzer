import { default as React } from 'react';

const Title = ({text}) => {
  return (
	<div className={`title`}>
		<div className='title--text'>{text}</div>
		<div className='title--bg'></div>
	</div>
  );
};

export default Title;