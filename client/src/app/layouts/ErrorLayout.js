import React, { } from 'react';

import './ErrorLayout.scss';

const ErrorLayout = ({ children }) => {

  return (
    <div class="page--404">
        {children}
    </div>    
  )
};
export default ErrorLayout;