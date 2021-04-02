import { default as React, useEffect, useState } from 'react';

const NumberLine = ({min=5, max=25, interval=5, inputFieldsPositions=[5,9]}) => {
	const [data, setData] = useState()

	useEffect(()=>{
		let result = [];
		for (let i = min; i <= max; i+=interval) {
			if (!inputFieldsPositions.includes((i+min)/interval)) {
				console.log(i/interval);
				result.push(<div className='NumberLine--number' key={i}><div>{i}</div><div className='NumberLine--number__verticalLine'></div></div>)
			} else{
				result.push(<div className='NumberLine--number' key={i}><input className='NumberLine--input' type='number' /><div className='NumberLine--number__verticalLine'></div></div>)
			}
		}
		console.log(result);
		setData([...result])
	}, [inputFieldsPositions, interval, min, max])

	useEffect(()=>{
		if (data) {
			let widths = [].slice.call(document.getElementsByClassName('NumberLine--number')).map(function(div){ return div.getBoundingClientRect().width; });
			let biggestDiv = Math.max.apply(null, widths);
			console.log(biggestDiv);

			let containerWidth = document.getElementsByClassName('NumberLine--numbersContainer')[0].getBoundingClientRect().width
			console.log(containerWidth);
			let items = document.getElementsByClassName('NumberLine--number');

			let maxWidth = 100/Math.floor(containerWidth/biggestDiv);

			for (let i = 0; i < items.length; i++) { 
				console.log(100/(containerWidth/biggestDiv));
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
			{min && max && data && data}
		</div>
	</div>
	);
};

export default NumberLine;