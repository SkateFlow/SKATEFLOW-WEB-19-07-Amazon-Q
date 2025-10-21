import React, { useEffect, useState } from 'react';
import { FaBars, FaUser, FaChevronDown } from 'react-icons/fa'
import { IconContext } from 'react-icons/lib';
import { animateScroll as scroll } from 'react-scroll'
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoSvg from '../../assets/images/logoof1.svg';
import logoInvertSvg from '../../assets/images/logoofinver.svg';
import { AnimatedScrollLink, AnimatedRouterLink } from './AnimatedNavLink';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Nav,
    NavbarContainer,
    NavLogo,
    MobileIcon,
    NavMenu,
    NavItem,
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
    const [hideTimeout, setHideTimeout] = useState(null)
    const { isAuthenticated, user, logout } = useAuth();

    const dropdownVariants = {
        open: {
            scaleY: 1,
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        closed: {
            scaleY: 0,
            opacity: 0,
            transition: {
                when: "afterChildren",
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        open: {
            opacity: 1,
            y: 0,
        },
        closed: {
            opacity: 0,
            y: -10,
        },
    };

    const chevronVariants = {
        open: { rotate: 180 },
        closed: { rotate: 0 },
    };

    const handleMouseEnter = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            setHideTimeout(null);
        }
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowDropdown(false);
        }, 300);
        setHideTimeout(timeout);
    };

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
                <Nav $scrollNav={finalScrollNav}>
                    <NavbarContainer>
                        <NavLeftSection>
                            <NavLogo to="/" onClick={toggleHome} $scrollNav={finalScrollNav}>
                                <img src={finalScrollNav ? logoInvertSvg : logoSvg} alt="SkateFlow" style={{ height: '70px', transition: 'all 1.2s ease' }} />
                            </NavLogo>
                            <NavMenu>
                                <NavItem>
                                    {location.pathname === '/' ? (
                                        <AnimatedScrollLink 
                                        to="events-hero"
                                        smooth={true}
                                        duration={500}
                                        spy={true}
                                        activeClass='active'
                                        exact='true'
                                        scrollNav={finalScrollNav}>Eventos</AnimatedScrollLink>
                                    ) : location.pathname === '/events' ? (
                                        <AnimatedRouterLink 
                                        to="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (window.showEventsNotification) {
                                                window.showEventsNotification();
                                            }
                                        }}
                                        scrollNav={finalScrollNav}>Eventos</AnimatedRouterLink>
                                    ) : (
                                        <AnimatedRouterLink to="/events" scrollNav={finalScrollNav}>Eventos</AnimatedRouterLink>
                                    )}
                                </NavItem>
                                <NavItem>
                                    {location.pathname === '/' ? (
                                        <AnimatedScrollLink 
                                        to="map-preview"
                                        smooth={true}
                                        duration={500}
                                        spy={true}
                                        activeClass='active'
                                        exact='true'
                                        scrollNav={finalScrollNav}>Pistas</AnimatedScrollLink>
                                    ) : location.pathname === '/map' ? (
                                        <AnimatedRouterLink 
                                        to="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (window.showMapNotification) {
                                                window.showMapNotification();
                                            }
                                        }}
                                        scrollNav={finalScrollNav}>Pistas</AnimatedRouterLink>
                                    ) : (
                                        <AnimatedRouterLink to="/map" scrollNav={finalScrollNav}>Pistas</AnimatedRouterLink>
                                    )}
                                </NavItem>
                                <NavItem>
                                <AnimatedScrollLink 
                                    to="services"
                                    smooth={true}
                                    duration={500}
                                    spy={true}
                                    activeClass='active'
                                    exact='true'
                                    scrollNav={finalScrollNav}>Sobre nós</AnimatedScrollLink>
                                </NavItem>
                                <NavItem>
                                    <AnimatedScrollLink 
                                    to="signup"
                                    smooth={true}
                                    duration={500}
                                    spy={true}
                                    activeClass='active'
                                    exact='true'
                                    scrollNav={finalScrollNav}>Mobile</AnimatedScrollLink>
                                </NavItem>
                            </NavMenu>
                        </NavLeftSection>
                        <MobileIcon onClick={toggle} $scrollNav={finalScrollNav}>
                            <FaBars style={{ color: finalScrollNav ? '#000' : '#fff', transition: 'all 1.2s ease' }} />
                        </MobileIcon>
                        <NavBtn>
                            {isAuthenticated ? (
                                <ProfileContainer
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <ProfileButton 
                                        $scrollNav={finalScrollNav}
                                        $hasPhoto={!!user?.foto}
                                        onMouseEnter={(e) => {
                                            if (!user?.foto) {
                                                const icons = e.currentTarget.querySelectorAll('svg');
                                                icons.forEach(icon => {
                                                    icon.style.color = finalScrollNav ? '#fff' : '#000';
                                                });
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!user?.foto) {
                                                const icons = e.currentTarget.querySelectorAll('svg');
                                                icons.forEach(icon => {
                                                    icon.style.color = finalScrollNav ? '#000' : '#fff';
                                                });
                                            }
                                        }}
                                    >
                                        {user?.foto ? (
                                            <img 
                                                src={user.foto} 
                                                alt={user.nome || 'Perfil'} 
                                                style={{ 
                                                    width: '40px', 
                                                    height: '40px', 
                                                    borderRadius: '50%', 
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    border: '2px solid transparent',
                                                    transition: 'border-color 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.borderColor = finalScrollNav ? '#000' : '#fff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.borderColor = 'transparent';
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <FaUser style={{ color: finalScrollNav ? '#000' : '#fff', transition: 'color 0.3s ease' }} />
                                                <motion.span
                                                    animate={showDropdown ? "open" : "closed"}
                                                    variants={chevronVariants}
                                                    style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}
                                                >
                                                    <FaChevronDown style={{ fontSize: '12px', color: finalScrollNav ? '#000' : '#fff', transition: 'color 0.3s ease' }} />
                                                </motion.span>
                                            </>
                                        )}
                                    </ProfileButton>
                                    <AnimatePresence>
                                        {showDropdown && (
                                            <ProfileDropdown
                                                initial="closed"
                                                animate="open"
                                                exit="closed"
                                                variants={dropdownVariants}
                                                style={{ originY: "top" }}
                                            >
                                                <motion.div variants={itemVariants}>
                                                    <ProfileEmail>{user.nome}</ProfileEmail>
                                                </motion.div>
                                                <AdminLink to={user?.isOrganizador ? "/organizador/perfil" : "/perfil"} variants={itemVariants}>
                                                    {user?.isOrganizador ? "Area do Organizador" : "Meu Perfil"}
                                                </AdminLink>
                                                {(user?.nivelAcesso === 'ADMIN' || user?.nivelAcesso === 'GERENTE') && (
                                                    <AdminLink to="/admin" variants={itemVariants}>
                                                        Área do Administrador
                                                    </AdminLink>
                                                )}
                                                <LogoutButton onClick={() => logout()} variants={itemVariants}>
                                                    Logout
                                                </LogoutButton>
                                            </ProfileDropdown>
                                        )}
                                    </AnimatePresence>
                                </ProfileContainer>
                            ) : (
                                <NavBtnLink to="/login" $scrollNav={finalScrollNav}>Log in</NavBtnLink>
                            )}
                        </NavBtn>
                    </NavbarContainer>
                </Nav>
            </IconContext.Provider>
        </>
    )
}

export default Navbar;