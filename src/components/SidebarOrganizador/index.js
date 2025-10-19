import React from 'react';
import styled from 'styled-components';
import { FiUser, FiCalendar, FiLogOut } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoWhite from '../../assets/images/logoof1.svg';

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #303f9f 100%);
  color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  img {
    height: 60px;
    width: auto;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 24px 0;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-left-color: #64b5f6;
  }
  
  ${props => props.active && `
    background: rgba(255, 255, 255, 0.15);
    border-left-color: #64b5f6;
    font-weight: 600;
  `}
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const UserSection = styled.div`
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #64b5f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const UserRole = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SidebarOrganizador = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems = [
    {
      path: '/organizador/perfil',
      icon: FiUser,
      label: 'Meu Perfil'
    },
    {
      path: '/organizador/eventos',
      icon: FiCalendar,
      label: 'Meus Eventos'
    }
  ];

  return (
    <SidebarContainer>
      <Logo>
        <Link to="/">
          <img src={logoWhite} alt="SkateFlow" />
        </Link>
      </Logo>

      <Navigation>
        {menuItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            active={location.pathname === item.path}
          >
            <NavIcon>
              <item.icon size={20} />
            </NavIcon>
            {item.label}
          </NavItem>
        ))}
      </Navigation>

      <UserSection>
        <UserInfo>
          <UserAvatar>
            {user?.nome?.charAt(0)?.toUpperCase() || 'O'}
          </UserAvatar>
          <UserDetails>
            <UserName>{user?.nome || 'Organizador'}</UserName>
            <UserRole>Organizador</UserRole>
          </UserDetails>
        </UserInfo>
        
        <LogoutButton onClick={handleLogout}>
          <FiLogOut size={16} />
          Sair
        </LogoutButton>
      </UserSection>
    </SidebarContainer>
  );
};

export default SidebarOrganizador;