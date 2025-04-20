import React, { useState, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';
import GoogleMapView from './components/GoogleMapView';
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
  const mapRef = useRef();

  const handleRouteSearch = (source, destination) => {
    if (mapRef.current) {
      console.log('Searching route from:', source, 'to:', destination);
      mapRef.current.getRoutesWithSafetyScore(source, destination);
    } else {
      console.error('Map reference not available');
    }
  };

  return (
    <Router>
      <AppContainer>
        <Header>
          <h1>SafeRoute</h1>
          <p>Because safety matters more than speed</p>
        </Header>
        <MainContent>
          <RouteInput onRouteSearch={handleRouteSearch} />
          <GoogleMapView ref={mapRef} />
          <SafetyLegend />
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 