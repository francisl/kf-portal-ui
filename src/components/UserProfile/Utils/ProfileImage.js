import React from 'react';
import Gravatar from 'uikit/Gravatar';

export const ProfileImage = ({ email = '', style = {} }) => (
  <Gravatar
    style={{
      height: '173px',
      width: '173px',
      borderRadius: '50%',
      border: '5px solid #fff',
      ...style,
    }}
    email={email}
  />
);
