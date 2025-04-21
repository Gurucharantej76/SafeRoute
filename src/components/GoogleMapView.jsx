import React, { useState, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, DirectionsRenderer, Marker, Circle } from '@react-google-maps/api';
import styled from 'styled-components';
import ErrorBoundary from './ErrorBoundary';

const MapWrapper = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  background-color: #f5f5f5;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 80%;
  z-index: 1000;
`;

const LoadingMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 1000;
`;

const SafetyScoreMarker = styled.div`
  background-color: ${props => props.score >= 80 ? '#00FF00' : props.score >= 50 ? '#FFA500' : '#FF0000'};
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
`;

const SafetyInfoWindow = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 200px;
`;

const SafetyScore = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.score >= 80 ? '#00FF00' : props.score >= 50 ? '#FFA500' : '#FF0000'};
  margin-bottom: 5px;
`;

const SafetyDetails = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const libraries = ['places', 'directions'];

const MapView = forwardRef((props, ref) => {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [safetyScores, setSafetyScores] = useState([]);
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Verify API key is present
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    version: 'weekly',
  });

  useEffect(() => {
    if (apiKey) {
      console.log('API Key is present and properly formatted');
    } else {
      console.error('API Key is missing');
    }
  }, [apiKey]);

  const onMapLoad = useCallback((map) => {
    console.log('Map loaded successfully');
    setMap(map);
  }, []);

  const onMapError = useCallback((error) => {
    console.error('Map error:', error);
    setMapError(error);
  }, []);

  const calculateSafetyScore = (route) => {
    let score = 100;
    let safetyDetails = {
      wellLitAreas: 0,
      crowdedAreas: 0,
      highRiskZones: 0,
      totalSteps: route.legs[0].steps.length
    };
    
    // Dummy data for demonstration (replace with actual data)
    const dangerZones = [
      { lat: 13.07, lng: 80.21, radius: 500, type: 'highRisk' },
      { lat: 13.06, lng: 80.25, radius: 300, type: 'lowLight' },
    ];

    const crowdedAreas = [
      { lat: 13.08, lng: 80.22, radius: 400 },
      { lat: 13.05, lng: 80.24, radius: 500 },
    ];

    try {
      route.legs[0].steps.forEach((step) => {
        const lat = step.end_location.lat();
        const lng = step.end_location.lng();
        
        // Check for danger zones
        dangerZones.forEach((zone) => {
          const distance = Math.sqrt(
            Math.pow(lat - zone.lat, 2) + Math.pow(lng - zone.lng, 2)
          );
          if (distance < 0.01) {
            score -= 30;
            if (zone.type === 'highRisk') safetyDetails.highRiskZones++;
            if (zone.type === 'lowLight') safetyDetails.wellLitAreas--;
          }
        });

        // Check for crowded areas (positive for safety)
        crowdedAreas.forEach((area) => {
          const distance = Math.sqrt(
            Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2)
          );
          if (distance < 0.01) {
            score += 10;
            safetyDetails.crowdedAreas++;
          }
        });
      });
    } catch (error) {
      console.error('Error calculating safety score:', error);
      return { score: 50, safetyDetails };
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      safetyDetails
    };
  };

  const getRoutesWithSafetyScore = async (origin, destination) => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps not loaded');
      setMapError(new Error('Google Maps not loaded'));
      return;
    }

    setIsLoading(true);
    setMapError(null);
    setSelectedRoute(null);

    try {
      const directionsService = new window.google.maps.DirectionsService();

      const response = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.WALKING, // Changed to walking mode
            provideRouteAlternatives: true,
          },
          (response, status) => {
            if (status === 'OK') {
              resolve(response);
            } else {
              reject(new Error(`Directions request failed: ${status}`));
            }
          }
        );
      });

      console.log('Routes found:', response.routes);
      const routeData = response.routes.map(route => calculateSafetyScore(route));
      const scores = routeData.map(data => data.score);
      const safetyDetails = routeData.map(data => data.safetyDetails);
      setSafetyScores(scores);
      setDirections(response);
    } catch (error) {
      console.error('Error getting routes:', error);
      setMapError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    getRoutesWithSafetyScore
  }));

  if (!apiKey) {
    return (
      <ErrorMessage role="alert">
        <h3>API Key Missing</h3>
        <p>Please add your Google Maps API key to the .env file:</p>
        <code>REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here</code>
      </ErrorMessage>
    );
  }

  if (loadError) {
    return (
      <ErrorMessage role="alert">
        <h3>Error Loading Maps</h3>
        <p>Please check your API key and ensure both Maps JavaScript API and Directions API are enabled.</p>
        <p>Error: {loadError.message}</p>
        <p>API Key Status: {apiKey ? 'Present' : 'Missing'}</p>
      </ErrorMessage>
    );
  }

  if (mapError) {
    return (
      <ErrorMessage role="alert">
        <h3>Map Error</h3>
        <p>{mapError.message}</p>
      </ErrorMessage>
    );
  }

  if (!isLoaded) {
    return (
      <LoadingMessage>
        <h3>Loading Maps...</h3>
        <p>Please wait while we load the map.</p>
      </LoadingMessage>
    );
  }

  return (
    <ErrorBoundary>
      <MapWrapper>
        {isLoading && (
          <LoadingMessage>
            <h3>Calculating Safe Routes...</h3>
            <p>Analyzing safety factors including lighting, crowd density, and risk zones</p>
          </LoadingMessage>
        )}
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          zoom={5}
          center={{ lat: 20.5937, lng: 78.9629 }}
          onLoad={onMapLoad}
          onError={onMapError}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
            keyboardShortcuts: true,
          }}
        >
          {directions && directions.routes.map((route, index) => (
            <React.Fragment key={index}>
              <DirectionsRenderer
                directions={{
                  ...directions,
                  routes: [route]
                }}
                options={{
                  polylineOptions: {
                    strokeColor: safetyScores[index] >= 80 ? '#00FF00' : 
                               safetyScores[index] >= 50 ? '#FFA500' : '#FF0000',
                    strokeWeight: 5,
                  },
                }}
                onClick={() => setSelectedRoute(index)}
              />
              <Marker
                position={route.legs[0].steps[
                  Math.floor(route.legs[0].steps.length / 2)
                ].end_location}
                onClick={() => setSelectedRoute(index)}
              >
                {selectedRoute === index && (
                  <SafetyInfoWindow>
                    <SafetyScore score={safetyScores[index]}>
                      Safety Score: {safetyScores[index]}%
                    </SafetyScore>
                    <SafetyDetails>
                      <div>Well-lit areas: {route.safetyDetails?.wellLitAreas}</div>
                      <div>Crowded areas: {route.safetyDetails?.crowdedAreas}</div>
                      <div>High-risk zones: {route.safetyDetails?.highRiskZones}</div>
                    </SafetyDetails>
                  </SafetyInfoWindow>
                )}
              </Marker>
            </React.Fragment>
          ))}
        </GoogleMap>
      </MapWrapper>
    </ErrorBoundary>
  );
});

export default MapView; 