import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { GoogleMap, useLoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';
import styled from 'styled-components';

const MapWrapper = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
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
`;

const libraries = ['places', 'directions'];

const MapView = forwardRef((props, ref) => {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [safetyScores, setSafetyScores] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    version: 'weekly',
  });

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const calculateSafetyScore = (route) => {
    let score = 100;
    
    // Dummy danger zones (replace with actual data)
    const dangerZones = [
      { lat: 13.07, lng: 80.21 },
      { lat: 13.06, lng: 80.25 },
    ];

    route.legs[0].steps.forEach((step) => {
      const lat = step.end_location.lat();
      const lng = step.end_location.lng();
      
      dangerZones.forEach((zone) => {
        const distance = Math.sqrt(
          Math.pow(lat - zone.lat, 2) + Math.pow(lng - zone.lng, 2)
        );
        if (distance < 0.01) score -= 30;
      });
    });

    return score;
  };

  const getRoutesWithSafetyScore = (origin, destination) => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps not loaded');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (response, status) => {
        if (status === 'OK') {
          console.log('Routes found:', response.routes);
          const scores = response.routes.map(route => calculateSafetyScore(route));
          setSafetyScores(scores);
          setDirections(response);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  };

  // Expose the function to parent component
  useImperativeHandle(ref, () => ({
    getRoutesWithSafetyScore
  }));

  if (loadError) {
    return (
      <ErrorMessage>
        <h3>Error Loading Maps</h3>
        <p>Please check your API key and ensure both Maps JavaScript API and Directions API are enabled.</p>
        <p>Error: {loadError.message}</p>
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
    <MapWrapper>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        zoom={5}
        center={{ lat: 20.5937, lng: 78.9629 }}
        onLoad={onMapLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {directions && directions.routes.map((route, index) => (
          <DirectionsRenderer
            key={index}
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
          />
        ))}
        {safetyScores.map((score, index) => (
          <Marker
            key={index}
            position={directions?.routes[index]?.legs[0]?.steps[
              Math.floor(directions.routes[index].legs[0].steps.length / 2)
            ]?.end_location}
            label={{
              text: `Score: ${score}`,
              color: score >= 80 ? '#00FF00' : score >= 50 ? '#FFA500' : '#FF0000',
            }}
          />
        ))}
      </GoogleMap>
    </MapWrapper>
  );
});

export default MapView; 