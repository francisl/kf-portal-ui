import React from 'react';
import { Table } from 'antd';
import { studiesColumns, StudiesResult } from '../../store/graphql/studies/models';

const StudyTableContainer = ({ data, loading }: any): React.ReactElement => {
  const tableData = data?.hits.edges.map((edge: { node: StudiesResult }) => ({
    ...edge.node,
  }));

  return loading ? (
    <div />
  ) : (
    <div>
      <Table columns={studiesColumns} dataSource={tableData} />
    </div>
  );
};

export default StudyTableContainer;
