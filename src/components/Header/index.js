// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../images/logo.png';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #343a40;
  color: white;
  border-bottom: 1px solid #495057;
  heigth: 100%;
  margin-top:20px;
`;

const LogoTitle = styled.div`
  display: flex;
  align-items: center;
  h1 {
    font-size: 1.5rem;
    margin-left: 10px;
  }
  img {
    width: 30px;
    height: 30px;
  }
`;

const Header = ({ title, goto }) => {


  return (
    <HeaderContainer>
      <Link to={goto} >Voltar</Link>
      <LogoTitle>
        <img src={logo} alt="Logo" />
        <h1>{title}</h1>
      </LogoTitle>
    </HeaderContainer>
  );
};

export default Header;
