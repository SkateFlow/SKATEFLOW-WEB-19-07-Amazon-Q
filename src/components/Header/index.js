// components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import styled from 'styled-components';
import logo from '../../assets/images/logo.png';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #343a40;
  color: white;
  border-bottom: 1px solid #495057;
  height: 100px; /* Corrigido 'heigth' para 'height' */
  margin-top: 20px;
`;

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  h1 {
    font-size: 1.5rem;
    margin-left: 10px;
  }
  img {
    width: 30px;
    height: 30px;
  }
`;

const BackLink = styled.button`
  background: none; /* Sem fundo */
  border: none; /* Sem borda */
  color: white; /* Cor do texto */
  font-size: 1rem; /* Tamanho da fonte */
  cursor: pointer; /* Cursor em forma de ponteiro */
  text-decoration: underline; /* Texto sublinhado */
  transition: color 0.3s; /* Transição suave de cor */

  &:hover {
    color: #ffc107; /* Cor ao passar o mouse */
  }
`;

const Header = ({ title }) => {
  const navigate = useNavigate(); // Criando uma instância do useNavigate

  const handleBackClick = () => {
    navigate("/"); // Redireciona para a tela inicial
  };

  return (
    <HeaderContainer>
      <BackLink onClick={handleBackClick}>Voltar</BackLink> {/* Usando BackLink estilizado */}
      <LogoTitle>
        <img src={logo} alt="Logo" />
        <h1>{title}</h1>
      </LogoTitle>
    </HeaderContainer>
  );
};

export default Header;