import React from 'react';
import styled from 'styled-components';

const LegendContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 4px;
  background-color: ${props => props.color};
`;

const SafetyLegend = () => {
  return (
    <LegendContainer>
      <h3>Safety Legend</h3>
      <LegendItem>
        <ColorBox color="#4CAF50" />
        <span>Safe Route (70-100)</span>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#FFC107" />
        <span>Moderate Risk (40-69)</span>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#F44336" />
        <span>High Risk (0-39)</span>
      </LegendItem>
    </LegendContainer>
  );
};

export default SafetyLegend; 