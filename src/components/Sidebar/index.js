import React from 'react'
import logoSvg from '../../assets/images/logoof1.svg';
import {
    SidebarContainer,
    Icon,
    CloseIcon,
    SidebarWrapper,
    SidebarMenu,
    SidebarLink,
    SideBtnWrap,
    SidebarRoute
} from './SidebarElements'

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <>
    {isOpen && <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 999}} onClick={toggle} />}
    <SidebarContainer isOpen={isOpen}>
        <Icon onClick={toggle}>
            <CloseIcon/>
        </Icon>
        <SidebarWrapper onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                <img src={logoSvg} alt="SkateFlow" style={{ height: '60px' }} />
            </div>
            <SidebarMenu>
                <SidebarLink to="/" onClick={toggle}>Home</SidebarLink>
                <SidebarLink to="/events" onClick={toggle}>Eventos</SidebarLink>
                <SidebarLink to="/map" onClick={toggle}>Mapa</SidebarLink>
                <SidebarLink to="/articles" onClick={toggle}>Artigos</SidebarLink>
                <SidebarLink to="https://www.example.com" onClick={toggle}>Mobile</SidebarLink>
            </SidebarMenu>
            <SideBtnWrap>
                <SidebarRoute to="/login" onClick={toggle}>Login</SidebarRoute>
            </SideBtnWrap>
        </SidebarWrapper>
    </SidebarContainer>
    </>
  )
}

export default Sidebar