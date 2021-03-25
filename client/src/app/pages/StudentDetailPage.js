import { default as React, Fragment, useCallback, useState, useEffect} from 'react';
import { useApi } from '../services';
import { useHistory } from 'react-router';
import { NavBar, ScoreCard, Title } from '../components';

const StudentDetailPage = () => {
	const [scores, setScores] = useState();
	const [password, setPassword] = useState('');
	const history = useHistory();
	const { getScoresFromStudent } = useApi();

	const initFetch = useCallback(() => {
		const fetchdata = async () => {
			let data = await getScoresFromStudent();
			setScores(data);
		}
		fetchdata();
	},[]);

	useEffect(() => {
		initFetch();
	}, [initFetch]);

  return (
    <Fragment>
      <div className='studentDetailPage-container'>
	  	{scores && 
				<Title text={scores[0].studentName}/>
			}
		{scores && scores.map((score, i)=>{
			return <ScoreCard name={score.exerciseName} score={score.score} key={i}/>
		})}
	</div>
	<NavBar active={'class'}/>
    </Fragment>
  );
};

export default StudentDetailPage;