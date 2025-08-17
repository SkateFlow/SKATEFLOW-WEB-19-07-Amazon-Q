import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa'
import { IconContext } from 'react-icons/lib';
import { animateScroll as scroll } from 'react-scroll'
import { useLocation } from 'react-router-dom';
import logoSvg from '../../assets/images/logoof1.svg';
import logoInvertSvg from '../../assets/images/logoofinver.svg';
import {
    Nav,
    NavbarContainer,
    NavLogo,
    MobileIcon,
    NavMenu,
    NavItem,
    NavLinks,
    NavLinksRouter,
    NavBtn,
    NavBtnLink,
    NavLeftSection
} from './NavbarElements';

const Navbar = ({ toggle }) => {
    const location = useLocation();
    const [scrollNav, setScrollNav] = useState(false)

    const changeNav = () => {
        if (window.scrollY >= 80) {
            setScrollNav(true)
        } else {
            setScrollNav(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', changeNav)
        return () => {
            window.removeEventListener('scroll', changeNav)
        }
    }, [])

    // Function from react-scroll
    const toggleHome = () => {
        scroll.scrollToTop();
    }


    return (
        // Empty tags are simplified <React.Fragment>

        // NavLogo is a react router link, which means that
        // it needs to have its own version of href, which is 'to'

        // IconContext.Provider is useful to change color of all icons
        // within the context
        
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <Nav scrollNav={scrollNav}>
                    <NavbarContainer>
                        <NavLeftSection>
                            <NavLogo to="/" onClick={toggleHome} scrollNav={scrollNav}>
                                <img src={scrollNav ? logoInvertSvg : logoSvg} alt="SkateFlow" style={{ height: '70px', transition: 'all 0.8s ease' }} />
                            </NavLogo>
                            <NavMenu>
                                <NavItem>
                                    {location.pathname === '/' ? (
                                        <NavLinks 
                                        to="events-hero"
                                        smooth={true}
                                        duration={500}
                                        spy={true}
                                        activeClass='active'
                                        exact='true'
                                        scrollNav={scrollNav}>Eventos</NavLinks>
                                    ) : (
                                        <NavLinksRouter to="/events" className={location.pathname === '/events' ? 'active' : ''} scrollNav={scrollNav}>Eventos</NavLinksRouter>
                                    )}
                                </NavItem>
                                <NavItem>
                                    <NavLinks 
                                    to="about"
                                    smooth={true}
                                    duration={500}
                                    spy={true}
                                    activeClass='active'
                                    exact='true'
                                    scrollNav={scrollNav}> Mapa </NavLinks>
                                </NavItem>
                                <NavItem>
                                <NavLinks 
                                    to="services"
                                    smooth={true}
                                    duration={500}
                                    spy={true}
                                    activeClass='active'
                                    exact='true'
                                    scrollNav={scrollNav}> Artigos </NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks 
                                    to="signup"
                                    smooth={true}
                                    duration={500}
                                    spy={true}
                                    activeClass='active'
                                    exact='true'
                                    scrollNav={scrollNav}> Mobile </NavLinks>
                                </NavItem>
                            </NavMenu>
                        </NavLeftSection>
                        <MobileIcon onClick={toggle} scrollNav={scrollNav}>
                            <FaBars />
                        </MobileIcon>
                        <NavBtn>
                            <NavBtnLink to="/login" scrollNav={scrollNav}> Login</NavBtnLink>
                        </NavBtn>
                    </NavbarContainer>
                </Nav>
            </IconContext.Provider>
        </>
    )
}

export default Navbar;