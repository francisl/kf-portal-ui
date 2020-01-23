import React from 'react';
import PropTypes from 'prop-types';
import notfound from '../assets/background-notfound.png';
import { Card, Row, Col } from 'antd';
import { Typography } from 'antd';

const { Title } = Typography;

const Error = ({ text = 'An error has occurred, please try again later' }) => (
  <Row
    type="flex"
    justify="center"
    align="middle"
    style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${notfound})`, //FIXME replace with proper image
      backgroundSize: 'cover',
    }}
  >
    <Col>
      <Card
        style={{
          width: 600,
          bordeRadius: 10,
          border: 'solid 1px #e0e1e6',
          boxShadow: '0 0 9.5px 0.5px rgba(160, 160, 163, 0.25)',
          backgroundColor: '#ffffff',
        }}
      >
        <Row>
          <Title level={2}>We can't seem to find the page you are looking for.</Title>
        </Row>
        <Row>
          <div>Reorient yourself by returning to your <a>Dashboard</a></div>
          <div>or start a new search in the <a>File Repository</a></div>
        </Row>
      </Card>
    </Col>
  </Row>
);

Error.propTypes = {
  text: PropTypes.string,
};

export default Error;
