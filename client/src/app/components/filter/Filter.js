import { default as React, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import * as Routes from '../../routes';
import {RiArrowDropDownFill, RiArrowDropUpFill} from 'react-icons/ri';
import {SearchBar} from './';

const Filter = ({data, setData}) => {
	const history = useHistory();
	const [open, setOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState([{type: 'Getallenkennis', active:false},{type: 'Bewerkingen', active:false}, { type: 'Meetkunde', active:false}, {type: 'Toepassingen', active:false}, { type: 'Meten en metend rekenen', active:false}]);

	const handleFilter =(i=-1) =>{
		let result = data;

		if(searchText != ''){
			result = result.filter(compareStrToSearch);
		}

		let temp = filters;
		if (i>=0) {
			temp[i].active= !filters[i].active;
			setFilters([...temp]);
		}

		if (filters.map((x)=> x.active).includes(true)) {
			result = result.filter((x)=>{return temp.map((x)=> x.active && x.type).includes(x.type)});
		}

		if (result.length === 0 && !filters.map((x)=> x.active).includes(true) && searchText == '') {
			setData(null);
		} else{
			setData([...result]);
		}
	}

	const compareStrToSearch = (value)=>{
		return value.name.toLowerCase().includes(searchText.toLowerCase())
	}

	useEffect(()=>{
		const timeout = setTimeout(() => {
			handleFilter()
		}, 750);
		return () => clearTimeout(timeout);
	}, [searchText])

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
							return <div key={i} className={`filterItem ${filter.type.split(' ').join('_')}${filter.active?'-active':''}`} onClick={()=>{ handleFilter(i);}}>{filter.type}</div>
						})}
					</div>
				</div>
				<div className='filter-container__body-row'>
					<div className='filter-container__body-row__subtitle'>
						Zoeken
					</div>
					<div className='filter-container__body-row__searchbar'>
						<SearchBar text={searchText} setText={setSearchText}/>
					</div>
				</div>

			</div>
		}
    </div>
  );
};

export default Filter;