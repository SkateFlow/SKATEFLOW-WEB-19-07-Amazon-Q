import styled from 'styled-components'
import { Link as LinkR } from 'react-router-dom'
import { Link as LinkS} from 'react-scroll'




export const Nav = styled.nav`
    background: ${({scrollNav}) => (scrollNav ? '#fff' : 'transparent')};
    height: 72px;
    margin-top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    transition: 0.8s all ease;
`

export const NavbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 72px;
    z-index: 1;
    width: 100%;
    padding: 0 160px;
    max-width: none;
    position: relative;
    
    @media screen and (max-width: 768px) {
        padding: 0 20px;
    }
`;

export const NavLeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

export const NavLogo = styled(LinkR)`
    color: ${({scrollNav}) => (scrollNav ? '#000' : '#fff')};
    justify-self: flex-start;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin-left: 24px;
    margin-right: 40px;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.8s ease;
    
    @media screen and (max-width: 768px) {
        margin-left: 0;
    }
`;

// Container do ícone do menu para mobile, aparece apenas com max-width: 768px
export const MobileIcon = styled.div`
    display: none;

    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 60%);
        font-size: 1.8rem;
        cursor: pointer;
        color: ${({scrollNav}) => (scrollNav ? '#000' : '#fff')};
        transition: color 0.8s ease;
    }
`;

// NavMenu para navegador: desaparece quando max-width: 768px
export const NavMenu = styled.ul`
    display: flex;
    align-items: center;
    list-style: none;
    text-align: center;
    margin-right: -22px;

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export const NavItem = styled.li`
    height: 72px;
`;

export const NavLinks = styled(LinkS)`
    color: ${({scrollNav}) => (scrollNav ? '#000' : '#fff')};
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1.5rem;
    height: 100%;
    cursor: pointer;
    transition: all 0.9s ease;
    font-weight: bold;

    &:hover {
        color: ${({scrollNav}) => (scrollNav ? '#1a66cc' : '#888')};
    }

    &.active {
        color: ${({scrollNav}) => (scrollNav ? '#1a66cc' : '#888')};
    }
`;

export const NavLinksRouter = styled(LinkR)`
    color: ${({scrollNav}) => (scrollNav ? '#000' : '#fff')};
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1.5rem;
    height: 100%;
    cursor: pointer;
    transition: all 0.8s ease;
    font-weight: bold;

    &:hover {
        color: ${({scrollNav}) => (scrollNav ? '#1a66cc' : '#888')};
    }

    &.active {
        color: ${({scrollNav}) => (scrollNav ? '#1a66cc' : '#888')};
    }
`;

// NavBtn para navegador: desaparece quando max-width: 768px
export const NavBtn = styled.nav`
    display: flex;
    align-items: center;

    @media screen and (max-width: 768px) {
        display: none;
    }
`;
export const NavBtnLink = styled(LinkR)`
    border-radius: 50px;
    background: transparent;
    white-space: nowrap;
    padding: 10px 22px;
    color: ${({scrollNav}) => (scrollNav ? '#000' : '#fff')};
    font-size: 16px;
    outline: none;
    border: ${({scrollNav}) => (scrollNav ? '1px solid #000' : '1px solid #fff')};
    cursor: pointer;
    transition: all 0.8s ease;
    text-decoration: none;
    font-weight: bold;

    &:hover {
        background: ${({scrollNav}) => (scrollNav ? '#000' : '#fff')};
        color: ${({scrollNav}) => (scrollNav ? '#fff' : '#000')};
    }
`;

export const ProfileContainer = styled.div`
    position: relative;
`;

export const ProfileButton = styled.button`
    border-radius: 50px;
    background: transparent;
    white-space: nowrap;
    padding: 10px 22px;
    color: ${({scrollNav}) => (scrollNav ? '#000' : '#fff')};
    font-size: 16px;
    outline: none;
    border: ${({scrollNav}) => (scrollNav ? '1px solid #000' : '1px solid #fff')};
    cursor: pointer;
    transition: all 0.8s ease;
    font-weight: bold;
    display: flex;
    align-items: center;

    &:hover {
        background: ${({scrollNav}) => (scrollNav ? '#000' : '#fff')};
        color: ${({scrollNav}) => (scrollNav ? '#fff' : '#000')};
    }
`;

export const ProfileDropdown = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    z-index: 1000;
    margin-top: 8px;
`;

export const ProfileEmail = styled.div`
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
    color: #4a5568;
    font-weight: 500;
`;

export const LogoutButton = styled.button`
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    color: #e53e3e;
    font-weight: 500;
    transition: background 0.2s ease;

    &:hover {
        background: #f7fafc;
    }
`;