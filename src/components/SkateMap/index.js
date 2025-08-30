import React, { useRef } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4a5568, #2d3748);
  border-radius: 8px;
  overflow: hidden;
`;

const MapHeader = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 10;
`;

const HeaderCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h3`
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 14px;
  color: #718096;
  margin: 4px 0 0 0;
`;

const MapBackground = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  background-image: 
    radial-gradient(circle at 30% 40%, rgba(0,0,0,0.03) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(0,0,0,0.02) 0%, transparent 50%);
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: 
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
`;

const MarkersContainer = styled.div`
  position: absolute;
  inset: 0;
`;

const MarkerButton = styled.button`
  position: absolute;
  transform: translate(-50%, -100%);
  transition: all 0.3s ease;
  z-index: ${props => props.isSelected ? 20 : 10};
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    transform: translate(-50%, -100%) scale(1.1);
  }
  
  ${props => props.isSelected && `
    transform: translate(-50%, -100%) scale(1.25);
    animation: pulse 2s infinite;
  `}
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const MarkerIcon = styled(FaMapMarkerAlt)`
  width: 32px;
  height: 32px;
  color: ${props => props.isSelected ? '#3182ce' : 'rgba(49, 130, 206, 0.7)'};
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  
  &:hover {
    color: #3182ce;
  }
`;

const MarkerLabel = styled.div`
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(4px);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ZoomIndicator = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ZoomText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #718096;
`;

const PulseIndicator = styled.div`
  width: 8px;
  height: 8px;
  background: #3182ce;
  border-radius: 50%;
  animation: pulse 2s infinite;
`;

export function SkateMap({ selectedSpot, spots, onSpotClick }) {
  const mapRef = useRef(null);
  const center = selectedSpot ? selectedSpot.coordinates : { lat: -23.5505, lng: -46.6333 };

  return (
    <MapContainer>
      <MapHeader>
        <HeaderCard>
          <HeaderTitle>
            {selectedSpot ? selectedSpot.name : 'Pistas de Skate em São Paulo'}
          </HeaderTitle>
          {selectedSpot && (
            <HeaderSubtitle>
              {selectedSpot.location}
            </HeaderSubtitle>
          )}
        </HeaderCard>
      </MapHeader>

      <MapBackground ref={mapRef}>
        <GridOverlay />

        <MarkersContainer>
          {spots.map((spot, index) => {
            const isSelected = selectedSpot?.id === spot.id;
            const x = ((spot.coordinates.lng + 46.7) / 0.3) * 100;
            const y = ((spot.coordinates.lat + 23.6) / 0.1) * 100;
            
            return (
              <MarkerButton
                key={spot.id}
                isSelected={isSelected}
                style={{
                  left: `${Math.max(10, Math.min(90, x))}%`,
                  top: `${Math.max(10, Math.min(90, 100 - y))}%`
                }}
                onClick={() => onSpotClick(spot)}
              >
                <div style={{ position: 'relative' }}>
                  <MarkerIcon isSelected={isSelected} />
                  <TypeIndicator type={spot.type} />
                </div>
                
                {isSelected && (
                  <MarkerLabel>
                    {spot.name}
                  </MarkerLabel>
                )}
              </MarkerButton>
            );
          })}
        </MarkersContainer>

        {selectedSpot && (
          <ZoomIndicator>
            <ZoomText>
              <PulseIndicator />
              Focalizando: {selectedSpot.name}
            </ZoomText>
          </ZoomIndicator>
        )}
      </MapBackground>
    </MapContainer>
  );
}