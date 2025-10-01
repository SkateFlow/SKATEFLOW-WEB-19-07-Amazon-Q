import React from 'react'
import logoInvertSvg from '../../assets/images/logoofinver.svg';
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(26,35,126,0.1)' }}>
                <img src={logoInvertSvg} alt="SkateFlow" style={{ height: '50px' }} />
            </div>
            <SidebarMenu>
                <SidebarLink to="/" onClick={toggle}>Home</SidebarLink>
                <SidebarLink to="/events" onClick={toggle}>Eventos</SidebarLink>
                <SidebarLink to="/map" onClick={toggle}>Pistas</SidebarLink>
                <SidebarLink to="#services" onClick={toggle}>Sobre nós</SidebarLink>
                <SidebarLink to="#signup" onClick={toggle}>Mobile</SidebarLink>
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