import { default as React, useEffect, useState } from 'react';
import { v4 } from 'uuid';

const NumberLine = ({ min, max, interval, inputFieldsPositions, setFillInValues=()=>{}, addCorrectValue=()=>{}, onTabPress= ()=>{}, filledInValues = false}) => {
	const [data, setData] = useState()
	const [wrongAnswer, setWrongAnswer] = useState(false);
	const [correctAnswers, setCorrectAnswers] = useState([]);
	let id = v4().replaceAll('-', '');

	useEffect(()=>{
		let result = [];
		let tempCorrectAnswers = [];
		if (min && max && interval && inputFieldsPositions) {
			for (let i = min; i <= max; i+=interval) {
				if (!inputFieldsPositions.split(",").map(Number).includes(((i-min)/interval)+1)) {
					result.push(<div className='NumberLine--number' key={i}><div>{i}</div><div className='NumberLine--number__verticalLine'></div></div>)
				} else if (filledInValues) {
					tempCorrectAnswers = [...tempCorrectAnswers, i]
					if(i !== parseInt(filledInValues[((i-min)/interval)])){
						setWrongAnswer(true);
					}
					result.push(
						<div className='NumberLine--number' key={i}>
							<input className={`NumberLine--input ${i === parseInt(filledInValues[((i-min)/interval)])?'correct':'wrong'}`} type='number' onKeyDown={onTabPress} value={filledInValues[((i-min)/interval)]} disabled={true}/>
							<div className='NumberLine--number__verticalLine'></div>
						</div>
					)
				} else {
					addCorrectValue((i-min)/interval, i.toString());
					result.push(
						<div className='NumberLine--number' key={i}>
							<input className='NumberLine--input' defaultValue={''} type='number' onKeyDown={onTabPress} onChange={(ev)=>{setFillInValues((i-min)/interval, ev.target.value)}}/>
							<div className='NumberLine--number__verticalLine'></div>
						</div>
					)
				}
			}
			setData([...result]);
		}
		setCorrectAnswers(tempCorrectAnswers);
		// eslint-disable-next-line
	}, [min, interval, max, inputFieldsPositions]);

	useEffect(()=>{
		if (data) {
			let container = document.querySelector(`#nl-${id}`);
			let widths = [].slice.call(container.querySelectorAll('.NumberLine--number')).map(function(div){ return div.getBoundingClientRect().width; });
			
			let biggestDiv = Math.max.apply(null, widths);
			let containerWidth = container.getBoundingClientRect().width;
			let items = container.querySelectorAll('.NumberLine--number');
			let maxWidth = 100/Math.floor(containerWidth/biggestDiv);

			if (maxWidth/100 * containerWidth < containerWidth/widths.length) {
				for (let i = 0; i < items.length; i++) {
					items[i].style.width = `${100/widths.length}%`
				}
			} else {
				for (let i = 0; i < items.length; i++) {
					items[i].style.width = `${maxWidth}%`
				}
			}
			
			let inputs = container.querySelectorAll('.NumberLine--input');
			for (let i = 0; i < inputs.length; i++) {
				inputs[i].style.width = `${biggestDiv*0.8}px`
			}
		}
	}, [data, id]);
	
	return (
		<div className='NumberLine' id={`nl-${id}`}>
			{data && 
				<>
				<div className='NumberLine--numbersContainer'>
					{data}
				</div>
				{wrongAnswer && 
					<div className='NumberLine--solution'>
						Oplossing: {correctAnswers.map((el, i)=>{
							return i === 0?el:`, ${el}`
						})}
					</div>
				}
				</>
			}
		</div>
	);
};

export default NumberLine;