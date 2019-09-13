import * as React from 'react';

const Title = ({ children, style }) => (
  <h2
    style={{
      ...style,
      color: 'rgb(43, 56, 143)',
      fontWeight: '500',
      fontFamily: '"Montserrat", "sans-serif"',
      fontSize: '22px',
      lineHeight: '1.27',
      letterSpacing: '0.3px',
      marginTop: '13px',
      marginRight: '15px',
      marginBottom: '29px',
      padding: '0px 0px 10px',
      textDecoration: 'none',
      borderBottom: '1px solid rgb(212, 214, 221)',
    }}
  >
    {children}
  </h2>
);

export default Title;
