import { default as React, useEffect } from 'react';
import { Route as ReactRoute } from 'react-router';

const renderMergedProps = (component, layout, routeProps) => {
  return (layout) ? React.createElement(layout, routeProps, React.createElement(component, routeProps)) : React.createElement(component, routeProps);
};

const RouteWithLayout = ({ component, layout, ...rest }) => {

  useEffect(()=>{
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [])

  window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  return (
    <>
        <ReactRoute {...rest} render={routeProps => {
          return renderMergedProps(component, layout, routeProps);
        }} />
    </>

  );
};

export default RouteWithLayout;