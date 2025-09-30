import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const SidebarContainer = styled.div`
  width: 250px;
  background-color:rgb(0, 42, 85);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const LogoContainer = styled.div`
  color: #5e5e5e;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #5e5e5e;

  span {
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const NavLink = styled(Link)`
  
  color:#5e5e5e;
  padding: 16px;
  padding-left: 30px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  &:hover {
    color: rgb(0, 93, 199) ;
  }
`;

const ExitLink = styled(Link)`
  color: #5e5e5e;
  padding: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 20px;
  &:hover {
    color: rgb(109, 0, 0);
  }
`;




const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <span>SkateFlow ADM</span>
      </LogoContainer>
      <NavLink to="/adminhome">
        <span>☷</span> Dashboard
      </NavLink>
      <NavLink to="/adminarticle">
        <span>⛷</span> Pistas
      </NavLink>
      <NavLink to="/admin">
        <span>★</span> Eventos
      </NavLink>
      <NavLink to="/admins">
        <span>⚙</span> Usuários
      </NavLink>
      <ExitLink to="/">↩ Sair</ExitLink>
    </SidebarContainer>
  );
};

export default Sidebar;