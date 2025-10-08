import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link as LinkS } from 'react-scroll';
import { Link as LinkR } from 'react-router-dom';

const LinkContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
`;

const StyledScrollLink = styled(LinkS)`
  color: ${({$scrollNav, $isHovered, $isActive}) => 
    $isActive || $isHovered 
      ? ($scrollNav ? '#1a66cc' : '#888') 
      : ($scrollNav ? '#000' : '#fff')
  };
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1.5rem;
  height: 100%;
  cursor: pointer;
  transition: color 0.3s ease;
  font-weight: bold;
  position: relative;
`;

const StyledRouterLink = styled(LinkR)`
  color: ${({$scrollNav, $isHovered, $isActive}) => 
    $isActive || $isHovered 
      ? ($scrollNav ? '#1a66cc' : '#888') 
      : ($scrollNav ? '#000' : '#fff')
  };
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1.5rem;
  height: 100%;
  cursor: pointer;
  transition: color 0.3s ease;
  font-weight: bold;
  position: relative;
`;

const UnderlineMotion = styled(motion.span)`
  position: absolute;
  bottom: 12px;
  left: 1.5rem;
  right: 1.5rem;
  height: 3px;
  background: ${({$scrollNav}) => ($scrollNav ? '#1a66cc' : '#888')};
  border-radius: 1.5px;
`;

export const AnimatedScrollLink = ({ children, scrollNav, isActive, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showUnderline = isHovered || isActive;

  return (
    <LinkContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledScrollLink 
        $scrollNav={scrollNav} 
        $isHovered={isHovered}
        $isActive={isActive}
        {...props}
      >
        {children}
        <UnderlineMotion
          $scrollNav={scrollNav}
          initial={{ scaleX: isActive ? 1 : 0 }}
          animate={{ scaleX: showUnderline ? 1 : 0 }}
          transition={{ duration: isActive ? 0 : 0.3, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
      </StyledScrollLink>
    </LinkContainer>
  );
};

export const AnimatedRouterLink = ({ children, scrollNav, isActive, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showUnderline = isHovered || isActive;

  return (
    <LinkContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledRouterLink 
        $scrollNav={scrollNav} 
        $isHovered={isHovered}
        $isActive={isActive}
        {...props}
      >
        {children}
        <UnderlineMotion
          $scrollNav={scrollNav}
          initial={{ scaleX: isActive ? 1 : 0 }}
          animate={{ scaleX: showUnderline ? 1 : 0 }}
          transition={{ duration: isActive ? 0 : 0.3, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
      </StyledRouterLink>
    </LinkContainer>
  );
};