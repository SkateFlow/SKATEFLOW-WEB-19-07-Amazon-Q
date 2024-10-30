import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import {
    Nav,
    NavbarContainer,
    NavLogo,
    MobileIcon,
    NavMenu,
    NavItem,
    NavLinks,
    NavBtn,
    NavBtnLink
} from './NavbarEvent';

const NavbarEvents = ({ toggle }) => {
    const [scrollNav, setScrollNav] = useState(false);

    // Função para alterar o estado do scrollNav baseado na posição do scroll
    const changeNav = () => {
        setScrollNav(window.scrollY >= 80);
    };

    useEffect(() => {
        // Adiciona o listener de scroll quando o componente é montado
        window.addEventListener('scroll', changeNav);
        
        // Remove o listener de scroll quando o componente é desmontado
        return () => window.removeEventListener('scroll', changeNav);
    }, []);

    return (
        <IconContext.Provider value={{ color: '#fff' }}>
            <Nav scrollNav={scrollNav}>
                <NavbarContainer>
                    <NavLogo to="/">SkateFlow</NavLogo>
                    <MobileIcon onClick={toggle}>
                        <FaBars />
                    </MobileIcon>
                    <NavMenu>
                        <NavItem>
                            <NavLinks to="/map">Mapa</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks to="/events">Eventos</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks to="/articles">Artigos</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks to="https://www.example.com">Mobile</NavLinks>
                        </NavItem>
                    </NavMenu>
                    <NavBtn>
                        <NavBtnLink to="/login">Login</NavBtnLink>
                    </NavBtn>
                </NavbarContainer>
            </Nav>
        </IconContext.Provider>
    );
};

export default NavbarEvents;
