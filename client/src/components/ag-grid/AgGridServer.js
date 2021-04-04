import React, { useCallback } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Box } from '@chakra-ui/react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { useHttp } from '../../hooks/useHttp';

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
    <Box
      className="ag-theme-alpine"
      style={{ height: 600 }}
      mt="4"
      mx="2"
      w="90%"
    >
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
        loadingOverlayComponent="customLoadingOverlay"
        components={{
          loadingRenderer: function (params) {
            if (params.value !== undefined) {
              return params.value;
            } else {
              return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
            }
          },
        }}
        rowBuffer={0}
        rowSelection={'multiple'}
        rowModelType={'infinite'}
        paginationPageSize={100}
        cacheOverflowSize={2}
        maxConcurrentDatasourceRequests={1}
        infiniteInitialRowCount={1000}
        maxBlocksInCache={10}
        onGridReady={onGridReady}
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
    </Box>
  );
};

export default AgGridServer;
