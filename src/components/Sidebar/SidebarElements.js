import styled from 'styled-components'
import { Link as LinkR } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'

export const SidebarContainer = styled.aside`
    position: fixed;
    z-index: 1000;
    width: 280px;
    height: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    transition: 0.3s ease-in-out;
    opacity: ${({ isOpen }) => (isOpen ? '100%' : '0')};
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
`;

export const CloseIcon = styled(FaTimes)`
    color: #1a237e;
`;

export const Icon = styled.div`
    position: absolute;
    top: 1.2rem;
    right: 1.5rem;
    background: transparent;
    font-size: 2rem;
    cursor: pointer;
    outline: none;
`;

export const SidebarWrapper = styled.div`
    color: #1a237e;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
`;

export const SidebarMenu = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 20px 15px;
    margin: 0;
    list-style: none;
`;

export const SidebarLink = styled(LinkR)`
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 20px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    color: #1a237e;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        background: rgba(255,255,255,0.6);
        transform: translateX(5px);
        box-shadow: 0 2px 8px rgba(26,35,126,0.15);
    }

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        background: #667eea;
        transform: scaleY(0);
        transition: transform 0.3s ease;
    }

    &:hover::before {
        transform: scaleY(1);
    }
`;

export const SideBtnWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px 0;
    border-top: 1px solid rgba(26,35,126,0.1);
    margin-top: auto;
`;

export const SidebarRoute = styled(LinkR)`
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #1a237e 100%);
    white-space: nowrap;
    padding: 12px 24px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    margin: 0 15px;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
`;