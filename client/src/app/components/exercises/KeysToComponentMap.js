import {NumberLine, MentalMath} from './';

const KeysToComponentMap = {
	"getallenassen": {componentName: NumberLine, states: [{name:'min', displayName:'Minimum waarde', value:5, type:'number'},{name:'max', displayName:'Maximum waarde', value:50, type:'number'},{name:'interval', displayName:'Interval', value:5, type:'number'},{name:'inputFieldsPositions', displayName:'Plaats van invulvelden', value:'3, 5', type:'text'}]},
	"hoofdrekenen": {componentName: MentalMath, states: [{name:'expression', displayName:'Opgave', value:'1+1', type:'text'}]}
};

export default KeysToComponentMap;