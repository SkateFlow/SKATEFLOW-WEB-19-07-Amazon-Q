import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #fff;
  color: black;
  padding: 20px;
  position: fixed;
`;

const SidebarLink = styled(Link)`
  display: block;
  color: black;
  text-decoration: none;
  padding: 10px;
  margin: 10px 0;
  transition: background 0.3s, color 0.3s, transform 0.3s, box-shadow 0.3s; /* Adiciona transições para todas as propriedades */
  border-radius: 4px; /* Adiciona bordas arredondadas para suavizar a aparência */

  &:hover {
    background-color: rgba(255, 255, 255, 0.2); /* Fundo um pouco mais escuro */
    color: #007bff; /* Muda a cor do texto ao passar o mouse */
    transform: scale(1.05); /* Aumenta ligeiramente o tamanho do link */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adiciona sombra ao link */
  }
`;

const SidebarAdmin = () => {
  return (
    <SidebarContainer>
      <h2>Admin Painel</h2>
      <SidebarLink to="/admin/events">Eventos</SidebarLink>
      <SidebarLink to="/admin/articles">Artigos</SidebarLink>
    </SidebarContainer>
  );
};

export default SidebarAdmin;
