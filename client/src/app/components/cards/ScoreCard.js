import { default as React } from 'react';
import {AiFillInfoCircle} from 'react-icons/ai';

const ScoreCard = ({name, score, onClick=()=>{}, extraClasses=''}) => {
	return (
	<div className={`ScoreCard--container ${extraClasses}`} onClick={()=>{onClick()}}>
		<div className={`ScoreCard--container__heading`}>
			<div className='ScoreCard--name'>{name}</div>
			<div className='ScoreCard--score'>{score} {score !== 'Nog niet ingediend' && <AiFillInfoCircle /> }</div>
		</div>
	</div>
	);
};

export default ScoreCard;