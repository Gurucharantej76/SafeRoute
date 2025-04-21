import React, { useState, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';
import GoogleMapView from './components/GoogleMapView';
import RouteInput from './components/RouteInput';
import SafetyLegend from './components/SafetyLegend';
import ErrorBoundary from './components/ErrorBoundary';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  background-color: #1a1a1a;
  color: white;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  position: relative;
  height: calc(100vh - 80px);
  overflow: hidden;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  font-size: 1rem;
  opacity: 0.8;
`;

const SOSButton = styled.button`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(255, 68, 68, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff0000;
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.9);
  }
`;

function App() {
  const mapRef = useRef();
  const [error, setError] = useState(null);

  const handleRouteSearch = async (source, destination) => {
    try {
      if (mapRef.current) {
        console.log('Searching route from:', source, 'to:', destination);
        await mapRef.current.getRoutesWithSafetyScore(source, destination);
        setError(null);
      } else {
        throw new Error('Map reference not available');
      }
    } catch (err) {
      console.error('Error searching route:', err);
      setError(err.message);
    }
  };

  const handleSOS = () => {
    // TODO: Implement SOS functionality
    alert('SOS signal sent! Emergency contacts have been notified.');
  };

  return (
    <ErrorBoundary>
      <Router>
        <AppContainer>
          <Header>
            <Title>SafeRoute</Title>
            <Subtitle>AI-powered safe routes for women's safety</Subtitle>
            <SOSButton onClick={handleSOS} aria-label="Emergency SOS Button">
              SOS
            </SOSButton>
          </Header>
          <MainContent>
            <RouteInput onRouteSearch={handleRouteSearch} error={error} />
            <GoogleMapView ref={mapRef} />
            <SafetyLegend />
          </MainContent>
        </AppContainer>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 