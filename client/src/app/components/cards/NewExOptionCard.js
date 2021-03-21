import { default as React } from 'react';

const NewExOptionCard = ({title, text, icon, onClick=()=>{}}) => {
	return (
	<div className='NewExOptionCard--container' onClick={()=>{onClick()}}>
		<div className={`NewExOptionCard--container__heading openedCard`}>
			<div className='NewExOptionCard--name'>{title}</div>
			{icon}
		</div>
		<div className='NewExOptionCard--container__body'>
			{text}
		</div>
	</div>
	);
};

export default NewExOptionCard;