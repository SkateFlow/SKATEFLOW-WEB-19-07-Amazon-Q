import styled from 'styled-components';

export const EventsContainer = styled.div`
     min-height: 120vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #d3d3d3ff;
    padding: 50px 0;
`;

export const EventCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
`;

export const EventCard = styled.div`
  flex: 1 1 calc(33.333% - 40px); /* 3 cards por linha */
  padding: 20px;
  border: 1px solid #e2e8f0;
  background-color: #d8d4d4ff;
  color: #1a202c;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 40px); /* 2 cards por linha em telas menores */
  }

  @media (max-width: 480px) {
    flex: 1 1 100%; /* 1 card por linha em telas muito pequenas */
  }

  img {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
    border-radius: 4px;
  }
`;