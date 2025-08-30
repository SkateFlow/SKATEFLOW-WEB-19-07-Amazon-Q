import React from "react";
import styled from "styled-components";
import { FiArrowRight, FiMail, FiMapPin } from "react-icons/fi";
import { SiGithub, SiTiktok, SiTwitter, SiYoutube } from "react-icons/si";
import logoInvertSvg from '../../assets/images/logoofinver.svg';

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 48px 16px;
  color: #1a202c;
  
  @media (max-width: 768px) {
    padding: 32px 12px;
    min-height: auto;
  }
  
  @media (max-width: 480px) {
    padding: 24px 8px;
  }
`;

const Logo = styled.div`
  width: auto;
  height: 40px;
  margin: 0 auto 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #1a202c;
  padding: 0 16px;
  font-size: 24px;
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin: 0 auto 32px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    margin: 0 auto 24px;
  }
`;

const Grid = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  
  @media (max-width: 1024px) {
    max-width: 768px;
    gap: 14px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const Block = styled.div`
  grid-column: span ${props => props.span || 4};
  border-radius: 8px;
  border: 2px solid #cbd5e0;
  background: #ffffff;
  padding: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: ${props => props.hoverRotate ? `rotate(${props.hoverRotate}) scale(1.1)` : 'none'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #a0aec0;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
    padding: 16px;
  }
`;

const HeaderBlock = styled(Block)`
  grid-column: span 12;
  grid-row: span 2;
  
  @media (min-width: 1024px) {
    grid-column: span 6;
  }
  
  @media (max-width: 768px) {
    grid-row: span 1;
  }
`;

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    margin: 0 auto 12px;
    display: block;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 48px;
  
  @media (max-width: 768px) {
    font-size: 1.875rem;
    margin-bottom: 32px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 24px;
    text-align: center;
  }
`;

const Subtitle = styled.span`
  color: #64748b;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3182ce;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SocialBlock = styled(Block)`
  grid-column: span 6;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  
  @media (min-width: 1024px) {
    grid-column: span 3;
  }
  
  @media (max-width: 768px) {
    grid-column: 1;
    min-height: 60px;
  }
  
  @media (max-width: 480px) {
    min-height: 50px;
  }
`;

const SocialLink = styled.a`
  font-size: 1.875rem;
  color: white;
  text-decoration: none;
`;

const AboutText = styled.p`
  font-size: 1.875rem;
  line-height: 1.3;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const LocationBlock = styled(Block)`
  grid-column: span 12;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  
  @media (min-width: 1024px) {
    grid-column: span 3;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const LocationText = styled.p`
  text-align: center;
  font-size: 1.125rem;
  color: #64748b;
`;

const EmailBlock = styled(Block)`
  grid-column: span 12;
  
  @media (min-width: 1024px) {
    grid-column: span 9;
  }
`;

const EmailForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #1a202c;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const EmailButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  padding: 8px 12px;
  border-radius: 4px;
  background: #3182ce;
  color: #ffffff;
  border: none;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #2c5aa0;
  }
`;

const Footer = styled.footer`
  margin-top: 48px;
  text-align: center;
  color: #64748b;
`;

const FooterLink = styled.a`
  color: #3182ce;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RevealBento = () => {
  return (
    <Container id="services">
      <Logo>Sobre Nós</Logo>
      <Grid>
        <HeaderBlock>
          <Avatar
            src={logoInvertSvg}
            alt="SkateFlow Logo"
          />
          <Title>
            Olá, somos o SkateFlow.{" "}
            <Subtitle>
              Conectamos a comunidade do skate brasileiro.
            </Subtitle>
          </Title>
          <ContactLink href="#">
            Entre em contato <FiArrowRight />
          </ContactLink>
        </HeaderBlock>

        <SocialBlock style={{ background: '#ef4444' }} hoverRotate="2.5deg">
          <SocialLink href="#">
            <SiYoutube />
          </SocialLink>
        </SocialBlock>

        <SocialBlock style={{ background: '#16a34a' }} hoverRotate="-2.5deg">
          <SocialLink href="#">
            <SiGithub />
          </SocialLink>
        </SocialBlock>

        <SocialBlock style={{ background: '#fafafa' }} hoverRotate="-2.5deg">
          <SocialLink href="#" style={{ color: '#000' }}>
            <SiTiktok />
          </SocialLink>
        </SocialBlock>

        <SocialBlock style={{ background: '#3b82f6' }} hoverRotate="2.5deg">
          <SocialLink href="#">
            <SiTwitter />
          </SocialLink>
        </SocialBlock>

        <Block span={12}>
          <AboutText>
            Nossa paixão é conectar skatistas.{" "}
            <Subtitle>
              Criamos uma plataforma completa para a comunidade do skate brasileiro, 
              com mapas de pistas, eventos e muito mais. Nosso objetivo é fortalecer 
              a cultura do skate no Brasil.
            </Subtitle>
          </AboutText>
        </Block>

        <LocationBlock>
          <FiMapPin style={{ fontSize: '1.875rem' }} />
          <LocationText>São Paulo, Brasil</LocationText>
        </LocationBlock>

        <EmailBlock>
          <p style={{ fontSize: '1.125rem', marginBottom: '12px' }}>
            Junte-se à nossa comunidade
          </p>
          <EmailForm onSubmit={(e) => e.preventDefault()}>
            <EmailInput
              type="email"
              placeholder="Digite seu email"
            />
            <EmailButton type="submit">
              <FiMail /> Participar
            </EmailButton>
          </EmailForm>
        </EmailBlock>
      </Grid>
      
      <Footer>
        <p>
          Feito com ❤️ pela equipe{" "}
          <FooterLink href="#">
            SkateFlow
          </FooterLink>
        </p>
      </Footer>
    </Container>
  );
};

export default RevealBento;