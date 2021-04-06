import React from 'react';
import { Box } from '@chakra-ui/react';

const AgGridWrapper = ({ children }) => {
  return (
    <Box className="ag-theme-alpine" my="4" px="8" w="100%" h="100%">
      {children}
    </Box>
  );
};

export default AgGridWrapper;
