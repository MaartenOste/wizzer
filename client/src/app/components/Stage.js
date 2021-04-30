import { default as React } from 'react';
import Logo from '../_static/icons/rekenmachine.png';

const Stage = ({ first, second, thrid }) => {
	return (
		<div className="stage--container">
			<img id="rek-1" src={Logo} alt="rekenmachine"></img>
			<img id="rek-2" src={Logo} alt="rekenmachine"></img>
			<div className="stage--container__column">
				<div className='stage--bar stage--bar__second'><span>2</span></div>
				<div className='stage--name'><span>{second}</span></div>
			</div>
			<div className="stage--container__column">
				<div className='stage--bar stage--bar__first'><span>1</span></div>
				<div className='stage--name'><span>{first}</span></div>
				
			</div>
			<div className="stage--container__column">
				<div className='stage--bar stage--bar__thrid'><span>3</span></div>
				<div className='stage--name'><span>{thrid}</span></div>
			</div>
		</div>
	);
};

export default Stage;