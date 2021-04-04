import React from 'react';
import { ChakraProvider, theme, Flex, Text, Divider } from '@chakra-ui/react';
import {
  Switch,
  Redirect,
  Route,
  BrowserRouter as Router,
} from 'react-router-dom';
import AgGridClient from './components/ag-grid/AgGridClient';
import NavigationLinks from './components/NavigationLinks';
import AgGridServer from './components/ag-grid/AgGridServer';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" alignItems="center">
        <Text fontSize="lg" color="whiteAlpha.900" my="1">
          Kingsmen Software Test
        </Text>
        <Divider />
        <Router>
          <NavigationLinks />
          <Switch>
            <Route path="/ag-grid-client" component={AgGridClient} />
            <Route path="/ag-grid-infinite" component={AgGridServer} />
            <Redirect to="/ag-grid-client" />
          </Switch>
        </Router>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
