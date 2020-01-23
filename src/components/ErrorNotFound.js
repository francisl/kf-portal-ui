import React from 'react';
import scienceBgPath from '../assets/background-science.jpg';
import logo from '../assets/logo-kids-first-data-portal.svg';
import Join from './Login/Join';
import joinImage from '../assets/smiling-boy.jpg';
import SideImagePage from './SideImagePage';

const ErrorNotFound = props => {

  return (
    <div className={'member-list-container'} style={{ backgroundColor: 'white' }}>
      <SideImagePage
        backgroundImage={scienceBgPath}
        logo={logo}
        Component={Join}
        sideImagePath={joinImage}
        {...props}
      />
    </div>
  );
};

export default ErrorNotFound;
