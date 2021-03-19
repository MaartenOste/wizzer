import { default as React, useState } from 'react';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';
import {RiArrowDropDownFill, RiArrowDropUpFill} from 'react-icons/ri';
import {IoSchool} from 'react-icons/io5';

const StudentCard = ({id, name}) => {
	const history = useHistory();

	const [open, setOpen] = useState(false);

	return (
	<div className='StudentCard--container'>
		<div className={`StudentCard--container__heading ${open && 'openedCard'}`} onClick={()=>{setOpen(!open)}}>
			<div className='StudentCard--name'>{name}</div>
			{open ? <RiArrowDropUpFill className='StudentCard--arrow'/> :<RiArrowDropDownFill  className='StudentCard--arrow'/>}
		</div>
		{open && 
		<div className='StudentCard--container__body' onClick={()=> {history.push(Routes.STUDENT_DETAIL.replace(':id', id))}}>
			<IoSchool/> rapport
		</div>
		}
	</div>
	);
};

export default StudentCard;