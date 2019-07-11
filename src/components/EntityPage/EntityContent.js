import * as React from 'react';

import styled from 'react-emotion';
import Column from 'uikit/Column';

const Container = styled(Column)`
`;

export default ({ children }) => <Container>{children}</Container>;
