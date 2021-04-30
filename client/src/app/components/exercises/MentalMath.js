import { default as React, useEffect, useState } from 'react';
var mexp = require('math-expression-evaluator');

const MentalMath = ({expression, setFillInValues=()=>{}, addCorrectValue=()=>{}, filledInValues = false}) => {
	const [data, setData] = useState()
	const [wrongAnswer, setWrongAnswer] = useState(false);
	const [correctAnswers, setCorrectAnswers] = useState([]);

	const onTabPress = (ev) =>{
		if (ev.key === 'Tab') {
			ev.preventDefault();
		}
	}

	useEffect(()=>{
		let result;
		let tempCorrectAnswer;
		if (expression) {
			if (filledInValues) {
				tempCorrectAnswer = [mexp.eval(expression)];
				if(mexp.eval(expression) !== filledInValues[0]){
					setWrongAnswer(true);
				}
				result = [<div className="MentalMath--innerContainer">{expression} = <input className={`MentalMath--input ${mexp.eval(expression) === parseInt(filledInValues[0])?'correct':'wrong'}`} type='text' onKeyDown={onTabPress} value={filledInValues[0]} disabled={true}/></div>];
			} else {
				try {
					addCorrectValue(0, mexp.eval(expression));
				} catch (error) {
				}
				result =[ <div className="MentalMath--innerContainer">{expression} = <input type="text" defaultValue={''} onKeyDown={onTabPress} onChange={(ev)=>{console.log(ev.target.value);setFillInValues(0, parseInt(ev.target.value))}}></input></div>];
			}
			setData(result);
		}
		setCorrectAnswers(tempCorrectAnswer);
		// eslint-disable-next-line
	}, [expression]);

	return (
		<div className='MentalMath'>
			{data && 
				<>
				<div className='MentalMath--numbersContainer'>
					{data}
				</div>
				{wrongAnswer && 
					<div className='MentalMath--solution'>
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

export default MentalMath;