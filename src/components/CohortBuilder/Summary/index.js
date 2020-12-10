import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Row, Typography } from 'antd';

import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import DemographicChart, { demographicQuery } from './Cards/DemographicChart';
import DiagnosesChart, { diagnosesQuery } from './Cards/DiagnosesChart';
import StudiesChart from './Cards/StudiesChart';
import AgeDiagChart, { ageDiagQuery } from './Cards/AgeDiagChart';
import SurvivalChart from './Cards/SurvivalChart';
import { dataTypesQuery, experimentalStrategyQuery } from './Cards/DataTypeChart';
import DataTypeCard from './Cards/DataTypeCard';
import OntologySunburst from 'components/Charts/Ontology/OntologySunburst';
import Card from '@ferlab-ui/core-react/lib/esnext/cards/GridCard';
import GridContainer from '@ferlab-ui/core-react/lib/esnext/layout/Grid';

import './Summary.css';

const { Title } = Typography;

const Summary = ({
  sqon = {
    op: 'and',
    content: [],
  },
  api,
}) => (
  <QueriesResolver
    name="GQL_SUMMARY_CHARTS"
    api={api}
    queries={[
      dataTypesQuery(sqon),
      experimentalStrategyQuery(sqon),
      demographicQuery(sqon),
      ageDiagQuery(sqon),
      diagnosesQuery(sqon),
    ]}
  >
    {({ isLoading, data = null }) => {
      const [
        dataTypesData = [],
        experimentalStrategyData = [],
        demographicData = [],
        ageDiagData = [],
        topDiagnosesData = [],
      ] = data;

      return !data ? (
        <Row nogutter> no data</Row>
      ) : (
        <>
          <GridContainer>
            <DataTypeCard
              isLoading={isLoading}
              dataTypesData={dataTypesData}
              experimentalStrategyData={experimentalStrategyData}
            />
            <Card
              title={<Title level={3}>Observed Phenotypes</Title>}
              classNameCardItem={'grid-container-item item-span-2-end item-row-1'}
            >
              <OntologySunburst sqon={sqon} />
            </Card>
            <StudiesChart sqon={sqon} isLoading={isLoading} />
            <DiagnosesChart sqon={sqon} topDiagnoses={topDiagnosesData} isLoading={isLoading} />
            <DemographicChart data={demographicData} isLoading={isLoading} />
            <AgeDiagChart data={ageDiagData} isLoading={isLoading} height={350} />
            <SurvivalChart sqon={sqon} />
          </GridContainer>
        </>
      );
    }}
  </QueriesResolver>
);

Summary.propTypes = {
  sqon: PropTypes.object,
  api: PropTypes.func.isRequired,
};

export default compose(withApi)(Summary);
