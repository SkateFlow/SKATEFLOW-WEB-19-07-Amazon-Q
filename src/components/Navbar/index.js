import React, { useEffect, useState } from 'react';
import { FaBars, FaUser, FaChevronDown } from 'react-icons/fa'
import { IconContext } from 'react-icons/lib';
import { animateScroll as scroll } from 'react-scroll'
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    NavLeftSection,
    ProfileContainer,
    ProfileButton,
    ProfileDropdown,
    ProfileEmail,
    AdminLink,
    LogoutButton
} from './NavbarElements';

const Navbar = ({ toggle, scrollNav: forceScrollNav }) => {
    const location = useLocation();
    const [scrollNav, setScrollNav] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const { isAuthenticated, user, logout } = useAuth();

    const changeNav = () => {
        if (window.scrollY >= 80) {
            setScrollNav(true)
        } else {
            setScrollNav(false)
        }
    }

    useEffect(() => {
        if (forceScrollNav === undefined) {
            window.addEventListener('scroll', changeNav)
            return () => {
                window.removeEventListener('scroll', changeNav)
            }
        }
    }, [forceScrollNav])

    const finalScrollNav = forceScrollNav !== undefined ? forceScrollNav : scrollNav;

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
                <Nav scrollNav={finalScrollNav}>
                    <NavbarContainer>
                        <NavLeftSection>
                            <NavLogo to="/" onClick={toggleHome} scrollNav={finalScrollNav}>
                                <img src={finalScrollNav ? logoInvertSvg : logoSvg} alt="SkateFlow" style={{ height: '70px', transition: 'all 0.8s ease' }} />
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
                                        scrollNav={finalScrollNav}>Eventos</NavLinks>
                                    ) : (
                                        <NavLinksRouter to="/events" className={location.pathname === '/events' ? 'active' : ''} scrollNav={finalScrollNav}>Eventos</NavLinksRouter>
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
                                    scrollNav={finalScrollNav}>Maps</NavLinks>
                                </NavItem>
                                <NavItem>
                                <NavLinks 
                                    to="services"
                                    smooth={true}
                                    duration={500}
                                    spy={true}
                                    activeClass='active'
                                    exact='true'
                                    scrollNav={finalScrollNav}>About</NavLinks>
                                </NavItem>
                                <NavItem>
                                    <NavLinks 
                                    to="signup"
                                    smooth={true}
                                    duration={500}
                                    spy={true}
                                    activeClass='active'
                                    exact='true'
                                    scrollNav={finalScrollNav}>Mobile</NavLinks>
                                </NavItem>
                            </NavMenu>
                        </NavLeftSection>
                        <MobileIcon onClick={toggle} scrollNav={finalScrollNav}>
                            <FaBars />
                        </MobileIcon>
                        <NavBtn>
                            {isAuthenticated ? (
                                <ProfileContainer>
                                    <ProfileButton 
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        scrollNav={finalScrollNav}
                                    >
                                        <FaUser />
                                        <FaChevronDown style={{ marginLeft: '8px', fontSize: '12px' }} />
                                    </ProfileButton>
                                    {showDropdown && (
                                        <ProfileDropdown>
                                            <ProfileEmail>{user.email}</ProfileEmail>
                                            <AdminLink to="/admin" onClick={() => setShowDropdown(false)}>
                                                Área do Administrador
                                            </AdminLink>
                                            <LogoutButton onClick={() => { logout(); setShowDropdown(false); }}>
                                                Logout
                                            </LogoutButton>
                                        </ProfileDropdown>
                                    )}
                                </ProfileContainer>
                            ) : (
                                <NavBtnLink to="/login" scrollNav={finalScrollNav}>Log in</NavBtnLink>
                            )}
                        </NavBtn>
                    </NavbarContainer>
                </Nav>
            </IconContext.Provider>
        </>
    )
}

export default Navbar;