import { default as React } from 'react';
import './PageLayout.scss';

const PageLayout = ({children}) => {
  return (
    <div className="page">
      <main className="page-main">
        {children}
      </main>

    </div>
  );
};

export default PageLayout;