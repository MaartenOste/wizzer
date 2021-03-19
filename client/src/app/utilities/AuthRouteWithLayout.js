import React from 'react';
import { Route, Redirect } from 'react-router';

import * as Routes from '../routes';
import { useAuth } from '../services';

const renderMergedProps = (component, layout, routeProps) => {
  return (layout) ? React.createElement(layout, routeProps, React.createElement(component, routeProps)) : React.createElement(component, routeProps);
};

const AuthRouteWithLayout = ({ component, layout, ...rest }) => {
  const { currentUser } = useAuth();
  return (
    <Route {...rest} render={routeProps => {
      return !!currentUser ? (
        renderMergedProps(component, layout, routeProps)
      ) : (
          <Redirect to={Routes.LOGIN} />
        );
    }
    } />
  );
};

export default AuthRouteWithLayout;