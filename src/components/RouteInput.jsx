import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    background-color: #333;
  }
`;

const RouteInput = ({ onRouteSearch }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearch = () => {
    if (source && destination) {
      onRouteSearch(source, destination);
    } else {
      alert('Please enter both source and destination');
    }
  };

  return (
    <InputContainer>
      <h3>Plan Your Safe Route</h3>
      <InputField
        type="text"
        placeholder="Enter source location"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <InputField
        type="text"
        placeholder="Enter destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <Button onClick={handleSearch}>Find Safe Route</Button>
    </InputContainer>
  );
};

export default RouteInput; 