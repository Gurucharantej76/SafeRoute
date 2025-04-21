import React from 'react';
import styled from 'styled-components';

const LegendContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const LegendTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #333;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 4px;
  background-color: ${props => props.color};
`;

const LegendText = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const SafetyFactors = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

const FactorItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #666;
`;

const FactorIcon = styled.span`
  margin-right: 8px;
  font-size: 1.2rem;
`;

function SafetyLegend() {
  return (
    <LegendContainer>
      <LegendTitle>Route Safety Legend</LegendTitle>
      <LegendItem>
        <ColorBox color="#00FF00" />
        <LegendText>Very Safe (80-100%)</LegendText>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#FFA500" />
        <LegendText>Moderately Safe (50-79%)</LegendText>
      </LegendItem>
      <LegendItem>
        <ColorBox color="#FF0000" />
        <LegendText>Less Safe (0-49%)</LegendText>
      </LegendItem>
      
      <SafetyFactors>
        <LegendTitle>Safety Factors</LegendTitle>
        <FactorItem>
          <FactorIcon>💡</FactorIcon>
          <LegendText>Well-lit Areas</LegendText>
        </FactorItem>
        <FactorItem>
          <FactorIcon>👥</FactorIcon>
          <LegendText>Crowded Areas</LegendText>
        </FactorItem>
        <FactorItem>
          <FactorIcon>⚠️</FactorIcon>
          <LegendText>High-risk Zones</LegendText>
        </FactorItem>
      </SafetyFactors>
    </LegendContainer>
  );
}

export default SafetyLegend; 