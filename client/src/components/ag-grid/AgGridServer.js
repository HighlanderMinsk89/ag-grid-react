import React, { useCallback } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { useHttp } from '../../hooks/useHttp';
import AgGridWrapper from './AgGridWrapper.js';

const AgGridServer = () => {
  const { request } = useHttp();

  const fetchChunkOfRows = useCallback(
    async params => {
      const response = await request(
        '/api/employee/infinite-model',
        'post',
        params
      );
      return response;
    },
    [request]
  );

  const onGridReady = params => {
    const updateData = () => {
      const dataSource = {
        rowCount: null,
        getRows: params => {
          fetchChunkOfRows(params)
            .then(data => {
              const { rows, lastRowIndex } = data;
              params.successCallback(rows, lastRowIndex);
            })
            .catch(e => console.log(e.message));
        },
      };
      params.api.setDatasource(dataSource);
    };

    updateData();
  };

  return (
    <AgGridWrapper>
      <AgGridReact
        defaultColDef={{
          flex: 1,
          resizable: true,
          sortable: true,
          filter: true,
          floatingFilter: true,
          minWidth: 100,
        }}
        animateRows={true}
        rowBuffer={0}
        rowModelType={'infinite'}
        paginationPageSize={100}
        maxConcurrentDatasourceRequests={1}
        maxBlocksInCache={10}
        onGridReady={onGridReady}
        loading
      >
        <AgGridColumn
          field="firstName"
          filterParams={{
            filterOptions: ['contains', 'equals'],
            suppressAndOrCondition: true,
          }}
        />
        <AgGridColumn
          field="lastName"
          filterParams={{
            filterOptions: ['contains', 'equals'],
            suppressAndOrCondition: true,
          }}
        />
        <AgGridColumn
          field="age"
          filter="number"
          filterParams={{
            filterOptions: ['equals', 'lessThan', 'greaterThan'],
            suppressAndOrCondition: true,
          }}
        />
        <AgGridColumn
          field="country"
          filterParams={{
            filterOptions: ['contains', 'equals'],
            suppressAndOrCondition: true,
          }}
        />
        <AgGridColumn
          field="company"
          filterParams={{
            filterOptions: ['contains', 'equals'],
            suppressAndOrCondition: true,
          }}
        />
      </AgGridReact>
    </AgGridWrapper>
  );
};

export default AgGridServer;
