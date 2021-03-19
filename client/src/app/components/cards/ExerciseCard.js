import { default as React, useState } from 'react';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';
import {RiArrowDropDownFill, RiArrowDropUpFill} from 'react-icons/ri';
import {FaRegEye, FaBook} from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Switch from "react-switch";


const ExerciseCard = ({id, name, isPublic = true}) => {
	const history = useHistory();
	const [open, setOpen] = useState(false);
	const [localPublic, setLocalPublic] = useState(isPublic);

	const makePublic = () =>{
		setLocalPublic(!localPublic)
	}

	const deleteExercise = () =>{
		console.log('delete exercise', name);
	}

	return (
	<div className='ExerciseCard--container'>
		<div className={`ExerciseCard--container__heading ${open && 'openedCard'}`} onClick={()=>{setOpen(!open)}}>
			<div className='ExerciseCard--name'>{name}</div>
			{open ? <RiArrowDropUpFill className='ExerciseCard--arrow'/> :<RiArrowDropDownFill  className='ExerciseCard--arrow'/>}
		</div>
		{open && 
			<div className='ExerciseCard--container__body' >
				<div className='ExerciseCard--container__body-row' onClick={()=> {makePublic()}}>
					<FaRegEye/> publiek <Switch className='switchComponent' checkedIcon={null} uncheckedIcon={null} checked={localPublic} onChange={()=>{makePublic()}}/>
				</div>
				<div className='ExerciseCard--container__body-row' onClick={()=> {history.push(Routes.EXERCISE_DETAIL.replace(':id', id))}}>
					<FaBook /> punten
				</div>
				<div className='ExerciseCard--container__body-row' onClick={()=> {deleteExercise()}}>
					<MdDelete/> verwijderen
				</div>
			</div>
		}
	</div>
	);
};

export default ExerciseCard;