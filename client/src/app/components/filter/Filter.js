import { default as React, useState } from 'react';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';
import {RiArrowDropDownFill, RiArrowDropUpFill} from 'react-icons/ri';
import {FaRegEye, FaBook} from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Switch from "react-switch";

const Filter = (props) => {
	const history = useHistory();
	const [open, setOpen] = useState(false);

  return (
    <div className='filter-container'>
		<div className={`filter-container__heading ${open && 'openedCard'}`} onClick={()=>{setOpen(!open)}}>
			<div className='ExerciseCard--name'>Filters</div>
			{open ? <RiArrowDropUpFill className='ExerciseCard--arrow'/> :<RiArrowDropDownFill  className='ExerciseCard--arrow'/>}
		</div>
		{open && 
			<div className='filter-container__body' >
				<div className='filter-container__body-row'>
					<div className='filter-container__body-row__subtitle'>
						Categorieën
					</div>
					<div className='filter-container__body-row__filters'>
					</div>
				</div>
				<div className='filter-container__body-row'>
					<div className='filter-container__body-row__subtitle'>
					</div>
					<div className='filter-container__body-row__filters'>
					</div>
				</div>

			</div>
		}
    </div>
  );
};

export default Filter;