import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMapPin, FiCalendar, FiUsers, FiLogOut } from 'react-icons/fi';
import styled from 'styled-components';
import logoSvg from '../../assets/images/logoof1.svg';

const SidebarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background: linear-gradient(135deg, #ffffff 0%, #bbdefb 100%);
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoContainer = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  color: #1a237e;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #3949ab;
  font-size: 12px;
  margin: 0;
  font-weight: 500;
`;

const MenuContainer = styled.div`
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  margin: 0 15px;
  height: 48px;
  border-radius: 12px;
  text-decoration: none;
  color: ${props => props.selected ? '#ffffff' : '#1a237e'};
  background: ${props => props.selected ? '#3949ab' : 'transparent'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => props.selected ? '#5c6bc0' : 'rgba(255,255,255,0.6)'};
    color: ${props => props.selected ? '#ffffff' : '#1a237e'};
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(57,73,171,0.15);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: #3949ab;
    transform: scaleY(${props => props.selected ? 1 : 0});
    transition: transform 0.3s ease;
  }
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
`;

const MenuText = styled.span`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
`;

const BottomSection = styled.div`
  padding: 15px 0;
  border-top: 1px solid rgba(57,73,171,0.2);
`;

const ExitButton = styled(Link)`
  display: flex;
  align-items: center;
  margin: 0 15px;
  height: 48px;
  border-radius: 12px;
  text-decoration: none;
  color: #1a237e;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.6);
    color: #d32f2f;
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(57,73,171,0.15);
  }
`;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: FiHome, title: "Dashboard", path: "/adminhome" },
    { icon: FiMapPin, title: "Pistas", path: "/adminarticle" },
    { icon: FiCalendar, title: "Eventos", path: "/admin" },
    { icon: FiUsers, title: "Usuários", path: "/admins" }
  ];

  return (
    <SidebarContainer>
      <Header>
        <LogoContainer>
          <img src={logoSvg} alt="SkateFlow" style={{ width: '24px', height: '24px', filter: 'brightness(0) saturate(100%) invert(13%) sepia(100%) saturate(7471%) hue-rotate(244deg) brightness(90%) contrast(106%)' }} />
        </LogoContainer>
        <div>
          <Title>SkateFlow</Title>
          <Subtitle>Admin Panel</Subtitle>
        </div>
      </Header>

      <MenuContainer>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const selected = location.pathname === item.path;
          return (
            <MenuItem key={item.title} to={item.path} selected={selected}>
              <IconContainer>
                <Icon size={20} />
              </IconContainer>
              <MenuText>{item.title}</MenuText>
            </MenuItem>
          );
        })}
      </MenuContainer>

      <BottomSection>
        <ExitButton to="/">
          <IconContainer>
            <FiLogOut size={20} />
          </IconContainer>
          <MenuText>Sair</MenuText>
        </ExitButton>
      </BottomSection>
    </SidebarContainer>
  );
};

export default Sidebar;