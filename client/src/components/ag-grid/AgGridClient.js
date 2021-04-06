import React, { useState, useEffect, useCallback } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Flex } from '@chakra-ui/react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { useHttp } from '../../hooks/useHttp';
import Loader from '../Loader.js';
import AgGridWrapper from './AgGridWrapper.js';
import { FlushCacheButton } from './FlushCacheButton.js';

const AgGridClient = () => {
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const { request, cancelRequest } = useHttp();
  const [mounted, setMounted] = useState(true);

  const onGridReady = params => {
    setGridApi(params.api);
  };

  const fetchData = useCallback(async () => {
    const data = await request('/api/employee/client-model');
    if (data && mounted) setRowData(data);
  }, [request, mounted]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      if (cancelRequest) {
        setMounted(false);
        cancelRequest();
      }
    };
  }, [cancelRequest]);

  useEffect(() => {
    gridApi?.showLoadingOverlay();
  }, [gridApi]);

  return (
    <Flex w="100%" h="100%" direction="column" alignItems="center" mt="4">
      <FlushCacheButton />
      <AgGridWrapper>
        <AgGridReact
          rowData={rowData}
          defaultColDef={{
            sortable: true,
            flex: 1,
            resizable: true,
            minWidth: 100,
          }}
          animateRows={true}
          onGridReady={onGridReady}
          loadingOverlayComponent="customLoadingOverlay"
          frameworkComponents={{
            customLoadingOverlay: Loader,
          }}
        >
          <AgGridColumn field="firstName" />
          <AgGridColumn field="lastName" />
          <AgGridColumn field="age" filter={true} />
          <AgGridColumn field="country" filter={true} />
          <AgGridColumn field="company" filter={true} />
        </AgGridReact>
      </AgGridWrapper>
    </Flex>
  );
};

export default AgGridClient;
