import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
    min-height: 120vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgb(0,41,79);
    background: linear-gradient(90deg, rgba(0,41,79,1) 0%, rgba(0,20,38,1) 35%, rgba(0,20,38,1) 100%);
    padding: 50px 0;
`;

export const MapWrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Icon = styled(Link)`
  margin-top: 32px;
  margin-bottom: 16px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 32px;

  &:hover {
    color: #00008B;
  }
`;

export const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormH1 = styled.h1`
  margin-bottom: 40px;
  color: #fff;
  font-size: 20px;
  text-align: center;
`;

export const Map = styled.div`
  width: 1500px;
  height: 500px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  display: flex; /* Adicionado para centralizar */
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center; /* Centraliza verticalmente */
`;


export const BackButton = styled(Link)`
  background: #00008B;
  padding: 10px 22px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: #0000CD;
    color: #010606;
  }
`;
