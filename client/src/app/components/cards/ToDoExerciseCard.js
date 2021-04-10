import { default as React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Routes from '../../routes';
import {RiArrowDropDownFill, RiArrowDropUpFill} from 'react-icons/ri';
import {FaPencilAlt, FaCalendarAlt} from 'react-icons/fa';
import {AiFillInfoCircle} from 'react-icons/ai';

const ToDoExerciseCard = ({name, score, id, onClick=()=>{}, extraClasses=''}) => {
	const [open, setOpen] = useState();
	const history = useHistory();

	return (
	<div className={`ToDoExerciseCard--container ${extraClasses}`}>
		{score === 'Nog niet ingediend'?
		<div className={`ToDoExerciseCard--container__heading ${open && 'openedCard'}`} onClick={()=>{setOpen(!open)}}>
			<div className='ToDoExerciseCard--name'>{name}</div>
			{open ? <RiArrowDropUpFill className='ToDoExerciseCard--arrow'/> : <RiArrowDropDownFill  className='ToDoExerciseCard--arrow'/>}
		</div>
		:
		<div className={`ToDoExerciseCard--container__heading ${open && 'openedCard'}`}>
			<div className='ToDoExerciseCard--name'>{name}</div>
			{<div className='ToDoExerciseCard--score'>{score}<AiFillInfoCircle /></div>}
			
		</div>}
		{open && 
			<div className='ToDoExerciseCard--container__body' >
				<div className='ToDoExerciseCard--container__body-row' onClick={()=> {}}>
					<FaCalendarAlt /> Indienen tot: {new Date().toJSON().slice(0,10).replace(/-/g,'/').split('/').reverse().join('/')}
				</div>
				<div className='ToDoExerciseCard--container__body-row' onClick={()=> {history.push(Routes.EXERCISE_COMPLETE.replace(':id', id))}}>
					<FaPencilAlt/> Invullen
				</div>
			</div>
		}
	</div>
	);
};

export default ToDoExerciseCard;