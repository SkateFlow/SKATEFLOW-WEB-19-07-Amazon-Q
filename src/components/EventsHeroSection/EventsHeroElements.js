import styled from 'styled-components';

export const EventsHeroContainer = styled.section`
  background: #ffffff;
  padding: 120px 0;
  position: relative;
  scroll-margin-top: 100px;
  min-height: 80vh;
  display: flex;
  align-items: center;
  
  @media (max-width: 1200px) {
    padding: 60px 0;
  }
  
  @media (max-width: 768px) {
    padding: 60px 0;
    min-height: 60vh;
  }
  
  @media (max-width: 480px) {
    padding: 40px 0;
    min-height: 50vh;
  }
`;

export const EventsHeroContent = styled.div`
  max-width: none;
  margin: 0;
  padding: 0 160px;
  
  @media (max-width: 1200px) {
    padding: 0 80px;
  }
  
  @media (max-width: 960px) {
    padding: 0 80px;
  }
  
  @media (max-width: 768px) {
    padding: 0 12px;
  }
  
  @media (max-width: 480px) {
    padding: 0 8px;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 300px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #000000;
  line-height: 1.1;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.span`
  display: block;
  background: linear-gradient(to right, #043C70, #0056b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Description = styled.p`
  font-size: 1.125rem;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.6;
  max-width: 500px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;

export const ExploreButton = styled.button`
  background: #043C70;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  gap: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #000000;
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
`;

export const EventCard = styled.div`
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin-left: 60px;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: 1120px) {
    display: none;
  }
  
  @media (max-width: 768px) {
    display: block;
    margin-left: 0;
    margin-right: 0;
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 16px;
`;

export const OverlayCard = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  background: rgba(29, 30, 33, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 16px;
`;

export const CardTitle = styled.h3`
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  font-size: 1rem;
`;

export const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

export const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ViewButton = styled.button`
  width: 100%;
  background: #043C70;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

export const DecorativeElement = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);

  &.top {
    top: -16px;
    right: -16px;
    width: 96px;
    height: 96px;
    background: rgba(4, 60, 112, 0.2);
  }

  &.bottom {
    bottom: -32px;
    left: -32px;
    width: 128px;
    height: 128px;
    background: rgba(0, 86, 179, 0.2);
  }
`;