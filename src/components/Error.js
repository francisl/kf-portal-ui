import React from 'react';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import SplashPage from 'components/SplashPage';

const Error = ({ text = 'An error has occurred, please try again later' }) => (
  <SplashPage>
    <div
      css={`
        text-align: center;
      `}
    >
      <Trans>{text}</Trans>
    </div>
  </SplashPage>
);

Error.propTypes = {
  text: PropTypes.string,
};

export default Error;
