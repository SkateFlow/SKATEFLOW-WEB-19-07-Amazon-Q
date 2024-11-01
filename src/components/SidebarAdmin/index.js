import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../images/system-logo_24_x_24.png';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #343a40;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #495057;
  img {
    margin-right: 8px;
  }
  span {
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const NavLink = styled(Link)`
  color: #adb5bd;
  padding: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
  width: 100%;
  text-align: center;
  &:hover {
    background-color: #495057;
    color: white;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <img src={logo} alt="logo" width="24" height="24"  />
        <span>AdminFlow</span>
      </LogoContainer>
      <NavLink to="/adminhome">Dashboard</NavLink>
      <NavLink to="/adminarticle">Artigos</NavLink>
      <NavLink to="/admin">Eventos</NavLink>
      <NavLink to="/admins">Usuários</NavLink>
    </SidebarContainer>
  );
};

export default Sidebar;
