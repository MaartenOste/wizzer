import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import * as Routes from './routes';
import {
  ClassPage,
	CreateExercisePage,
	ExerciseDetailPage,
	ExercisesPage,
  HomePage,
	JoinClassGroupPage,
	LoginPage,
	StudentDetailPage } from './pages';
import { AuthRouteWithLayout, RouteWithLayout } from './utilities';
import { ApiProvider, AuthProvider } from './services';
import { PageLayout } from './layouts';

import './app.scss';

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <ApiProvider>
          <Router basename='/'>
            <Switch>
              <RouteWithLayout exact path={Routes.LOGIN} layout={PageLayout} component={LoginPage} />
              <AuthRouteWithLayout exact path={Routes.HOME} layout={PageLayout} component={HomePage} />

              <AuthRouteWithLayout exact path={Routes.CLASSGROUP} layout={PageLayout} component={ClassPage}/>
              <AuthRouteWithLayout exact path={Routes.JOIN_CLASSGROUP} layout={PageLayout} component={JoinClassGroupPage}/>
              <AuthRouteWithLayout exact path={Routes.STUDENT_DETAIL} layout={PageLayout} component={StudentDetailPage}/>
              
              <AuthRouteWithLayout exact path={Routes.EXERCISE} layout={PageLayout} component={ExercisesPage}/>
              <AuthRouteWithLayout exact path={Routes.EXERCISE_DETAIL} layout={PageLayout} component={ExerciseDetailPage}/>
              <AuthRouteWithLayout exact path={Routes.CREATE_EXERCISE} layout={PageLayout} component={CreateExercisePage}/>
            </Switch>
          </Router>
        </ApiProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
