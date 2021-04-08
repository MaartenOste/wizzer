import { default as React, useEffect, useState } from 'react';

const NumberLine = ({min, max, interval, inputFieldsPositions}) => {
	const [data, setData] = useState()

	useEffect(()=>{
		let result = [];
		/*console.log(min);
		console.log(max);
		console.log(interval);
		console.log(inputFieldsPositions);*/
		if (min && max && interval && inputFieldsPositions) {
			for (let i = min; i <= max; i+=interval) {
				if (!inputFieldsPositions.split(",").map(Number).includes(((i-min)/interval)+1)) {
					result.push(<div className='NumberLine--number' key={i}><div>{i}</div><div className='NumberLine--number__verticalLine'></div></div>)
				} else{
					result.push(<div className='NumberLine--number' key={i}><input className='NumberLine--input' type='number' /><div className='NumberLine--number__verticalLine'></div></div>)
				}
			}
			setData([...result]);
		}
		// eslint-disable-next-line
	}, [min, interval, max, inputFieldsPositions])

	useEffect(()=>{
		if (data) {
			let widths = [].slice.call(document.getElementsByClassName('NumberLine--number')).map(function(div){ return div.getBoundingClientRect().width; });
			let biggestDiv = Math.max.apply(null, widths);
			let containerWidth = document.getElementsByClassName('NumberLine--numbersContainer')[0].getBoundingClientRect().width
			let items = document.getElementsByClassName('NumberLine--number');
			let maxWidth = 100/Math.floor(containerWidth/biggestDiv);

			for (let i = 0; i < items.length; i++) { 
				items[i].style.width = `${maxWidth}%`
			}

			let inputs = document.getElementsByClassName('NumberLine--input');
			for (let i = 0; i < inputs.length; i++) {
				inputs[i].style.width = `${biggestDiv*0.8}px`
			}
		}
	}, [data])
	
	return (
	<div className='NumberLine'>
		<div className='NumberLine--numbersContainer'>
			{data}
		</div>
	</div>
	);
};

export default NumberLine;