import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

const MapWrapper = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
`;

const MapView = () => {
  const [position] = useState([20.5937, 78.9629]); // Center of India
  const [routes] = useState([]);

  return (
    <MapWrapper>
      <MapContainer
        center={position}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        {routes.map((route, index) => (
          <Polyline
            key={index}
            positions={route.coordinates}
            color={route.safetyScore > 70 ? 'green' : route.safetyScore > 40 ? 'yellow' : 'red'}
            weight={5}
            opacity={0.7}
          />
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default MapView; 