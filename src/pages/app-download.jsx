import React from 'react';
import styled from 'styled-components';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import playstoreImg from '../assets/images/playstore.png';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 30px;
  left: 30px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 40px;
  text-align: center;
  max-width: 600px;
`;



const PlayStoreImage = styled.img`
  max-width: 90%;
  max-height: 60vh;
  width: auto;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  margin: 20px 0;

  &:hover {
    transform: scale(1.02);
  }
`;

const ComingSoonBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  margin-top: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const AppDownloadPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>
        <FiArrowLeft size={24} />
      </BackButton>
      
      <Title>SkateFlow Mobile</Title>
      <Subtitle>
        Em breve na Play Store! Tenha acesso a todas as funcionalidades do SkateFlow na palma da sua mão.
      </Subtitle>
      
      <PlayStoreImage 
        src={playstoreImg}
        alt="SkateFlow na Play Store"
      />
      
      <ComingSoonBadge>
        Em Desenvolvimento
      </ComingSoonBadge>
    </Container>
  );
};

export default AppDownloadPage;