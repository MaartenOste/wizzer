import React from 'react';
import {BrowserRouter as Router, Redirect, Switch} from 'react-router-dom';
//import { MemoryRouter } from 'react-router';
import * as Routes from './routes';
import {
  ClassPage,
	CreateExercisePage,
	ExerciseDetailPage,
	ExercisesPage,
  ErrorPage,
	JoinClassGroupPage,
	LoginPage,
	StudentDetailPage } from './pages';
import { AuthRouteWithLayout, RouteWithLayout } from './utilities';
import { ApiProvider, AuthProvider } from './services';
import { ErrorLayout, PageLayout } from './layouts';

import './app.scss';

function App() {

  return (
    <div className="app">
      <AuthProvider>
        <ApiProvider>
          <Router basename='/'>
            <Switch>
              <RouteWithLayout exact path={Routes.LOGIN} layout={PageLayout} component={LoginPage} />
              <Redirect exact to={Routes.LOGIN} from={Routes.HOME}/>

              <AuthRouteWithLayout exact path={Routes.CLASSGROUP} layout={PageLayout} component={ClassPage}/>
              <AuthRouteWithLayout exact path={Routes.JOIN_CLASSGROUP} layout={PageLayout} component={JoinClassGroupPage}/>
              <AuthRouteWithLayout exact path={Routes.STUDENT_DETAIL} layout={PageLayout} component={StudentDetailPage}/>
              
              <AuthRouteWithLayout exact path={Routes.EXERCISE} layout={PageLayout} component={ExercisesPage}/>
              <AuthRouteWithLayout exact path={Routes.CREATE_EXERCISE} layout={PageLayout} component={CreateExercisePage}/>
              <AuthRouteWithLayout exact path={Routes.EXERCISE_DETAIL} layout={PageLayout} component={ExerciseDetailPage}/>

              <RouteWithLayout exact path={'/*'} layout={ErrorLayout} component={ErrorPage} />
            </Switch>
          </Router>
        </ApiProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
