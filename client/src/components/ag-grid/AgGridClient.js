import React, { useState, useEffect, useCallback } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Box } from '@chakra-ui/react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { useHttp } from '../../hooks/useHttp';
import Loader from '../Loader';

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
    <Box
      className="ag-theme-alpine"
      style={{ height: 600 }}
      mt="4"
      mx="2"
      w="90%"
    >
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
    </Box>
  );
};

export default AgGridClient;
