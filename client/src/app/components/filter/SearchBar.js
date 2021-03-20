import { default as React } from 'react';
import { IoSearch } from 'react-icons/io5';


const SearchBar = ({text, setText= ()=>{}}) => {

  return (
    <div className={`searchbar-container ${text.length>0 ? 'hasText':''}`}>
		<input className='searchbar-input' placeholder='Zoek een oefening' value={text} onChange={(e)=> setText(e.target.value)}></input>
		<IoSearch className='searchbar-icon'/>
    </div>
  );
};

export default SearchBar;