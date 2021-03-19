import { default as React, useState } from 'react';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';
import {RiArrowDropDownFill, RiArrowDropUpFill} from 'react-icons/ri';
import {FaRegEye, FaBook} from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Switch from "react-switch";

const Filter = ({}) => {
	const history = useHistory();
	const [open, setOpen] = useState(false);

	const [filters, setFilters] = useState([{type: 'Getallenkennis', active:false},{type: 'Bewerkingen', active:false}, { type: 'Meetkunde', active:false}, { type: 'Meten en metend rekenen', active:false}, {type: 'Toepassingen', active:false}]);

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
						{filters && filters.map((filter, i)=>{
							return <div className={`filterItem ${filter.type.split(' ').join('_')}${filter.active?'-active':''}`} onClick={()=>{let temp = filters; filters[i].active= !filter.active; setFilters([...temp])}}>{filter.type}</div>
						})}

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