import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';
import MapView from './components/MapView';
import RouteInput from './components/RouteInput';
import SafetyLegend from './components/SafetyLegend';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const Header = styled.header`
  background-color: #1a1a1a;
  color: white;
  padding: 1rem;
  text-align: center;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  position: relative;
  height: calc(100vh - 80px);
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header>
          <h1>SafeRoute</h1>
          <p>Because safety matters more than speed</p>
        </Header>
        <MainContent>
          <RouteInput />
          <MapView />
          <SafetyLegend />
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 