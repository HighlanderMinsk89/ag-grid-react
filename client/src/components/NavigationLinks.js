import React from 'react';
import { Link } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

const NavigationLinks = () => {
  return (
    <Flex justify="space-around" w="90%" color="blue.300" mt="2">
      <Link to="/ag-grid-client">AG Grid Client</Link>
      <Link to="/ag-grid-infinite"> AG Grid Server</Link>
    </Flex>
  );
};

export default NavigationLinks;
