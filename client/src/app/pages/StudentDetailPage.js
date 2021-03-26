import { default as React, Fragment, useCallback, useState, useEffect} from 'react';
import { useApi } from '../services';
import { useParams } from 'react-router';
import { NavBar, ScoreCard, Title } from '../components';

const StudentDetailPage = () => {
	const [exercises, setExercises] = useState();
	const { getFilledInExerciseFromStudent } = useApi();
	const { id } = useParams();


	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			let data = await getFilledInExerciseFromStudent(id);
			console.log(data);
			setExercises(data);
		}
		fetchdata();
	},[getFilledInExerciseFromStudent, id]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

  return (
    <Fragment>
      <div className='studentDetailPage-container'>
	  	{exercises && 
				<Title text={`${exercises[0].completedBy.firstname} ${exercises[0].completedBy.lastname}`}/>
			}
		{exercises && exercises.map((exercise, i)=>{
			return <ScoreCard name={exercise.exercise.title} score={exercise.score} key={i}/>
		})}
	</div>
	<NavBar active={'class'}/>
    </Fragment>
  );
};

export default StudentDetailPage;