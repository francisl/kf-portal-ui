import React from 'react';
import { Trans } from 'react-i18next';

import SplashPage from 'components/SplashPage';

export default ({text = "An error has occurred, please try again later"}) => (
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
