import React, { FC } from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import PageContent from 'components/Layout/PageContent';
import StudiesFiltersSider from './StudiesFiltersSider';
import StudyPageContainer from './StudyPageContainer';
import styles from './studies.module.scss';

import { useGetExtendedMappings, useGetStudiesPageData } from '../../store/graphql/studies/actions';
import { useFilters } from './utils';

const Studies: FC = () => {
  const { filters } = useFilters();
  const { loading: loadingData, results: data } = useGetStudiesPageData({ sqon: filters });
  const { loading: mappingLoading, results: studyMapping } = useGetExtendedMappings('study');

  return (
    <StackLayout horizontal className={styles.layout}>
      <StudiesFiltersSider
        studyMapping={studyMapping}
        mappingLoading={mappingLoading}
        data={data}
        loading={loadingData}
      />
      <PageContent title="Studies">
        <StudyPageContainer data={data} loading={loadingData} filters={filters} />
      </PageContent>
    </StackLayout>
  );
};

export default Studies;
