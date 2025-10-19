import styled from 'styled-components'
import { Link } from 'react-router-dom'
//import fundoLogin from '../src/images/fundoLogin.svg';
import fundoLogin from './fundoLogin.svg';


export const Container = styled.div`
    min-height: 692px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 0;
    overflow: hidden;
    background-image: url(${fundoLogin});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`

export const FormWrap = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    padding-top: 160px;

    @media screen and (max-width: 400px) {
        height: 80%;
        padding: 10px;
        padding-top: 140px;
    }
`

export const Icon = styled(Link)`
    margin-left: 32px;
    margin-top: 32px;
    text-decoration: none;
    color: #fff;
    font-weight: 700;
    font-size: 32px;

    @media screen and (max-width: 480px) {
        margin-left: 16px;
        margin-top: 8px;
    }
`

export const FormContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 450px;

    @media screen and (max-width: 480px) {
        padding: 10px;
        max-width: 100%;
    }
`

export const Form = styled.form`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    width: 100%;
    max-width: 400px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 40px 32px;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .input-group {
        position: relative;
        margin-bottom: 24px;
        width: 100%;
    }

    .password-group {
        position: relative;
    }

    .form-input {
        width: 100%;
        padding: 16px 0;
        background: transparent;
        border: none;
        border-bottom: 2px solid #e0e0e0;
        color: #333;
        font-size: 16px;
        outline: none;
        transition: all 0.3s ease;

        &:focus {
            border-bottom-color: #043C70;
        }

        &::placeholder {
            color: #999;
            transition: all 0.3s ease;
        }

        &:focus::placeholder {
            opacity: 0.7;
        }
    }

    .password-input {
        padding-right: 40px;
    }

    .password-toggle {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        font-size: 18px;
        padding: 8px;
        transition: color 0.3s ease;

        &:hover {
            color: #043C70;
        }
    }

    .error-message {
        background: rgba(244, 67, 54, 0.1);
        border: 1px solid rgba(244, 67, 54, 0.3);
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 20px;
        text-align: center;

        p {
            color: #d32f2f;
            font-size: 14px;
            margin: 0;
        }
    }

    .success-message {
        background: rgba(76, 175, 80, 0.1);
        border: 1px solid rgba(76, 175, 80, 0.3);
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 20px;
        text-align: center;

        p {
            color: #388e3c;
            font-size: 14px;
            margin: 0;
        }
    }

    .account-deleted-message {
        background: rgba(255, 152, 0, 0.1);
        border: 1px solid rgba(255, 152, 0, 0.3);
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 20px;
        text-align: center;

        p {
            color: #f57c00;
            font-size: 14px;
            margin: 0;
            font-weight: 500;
        }
    }

    .submit-button {
        background: linear-gradient(135deg, #043C70 0%, #0056a3 100%);
        border: none;
        border-radius: 12px;
        color: white;
        font-size: 16px;
        font-weight: 600;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 24px;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(4, 60, 112, 0.3);
        }

        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    }

    .form-links {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
    }

    .toggle-button {
        color: #043C70;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 8px 16px;
        border-radius: 8px;
        background: none;
        border: none;
        font-size: 14px;

        &:hover {
            background: rgba(4, 60, 112, 0.1);
            text-decoration: none;
        }
    }

    .back-button {
        color: #666;
        text-decoration: none;
        font-size: 14px;
        transition: color 0.3s ease;

        &:hover {
            color: #043C70;
            text-decoration: underline;
        }
    }

    @media screen and (max-width: 400px) {
        padding: 32px 24px;
        border-radius: 16px;
        
        .form-input {
            font-size: 14px;
        }
        
        .submit-button {
            font-size: 14px;
        }
    }
`

export const FormH1 = styled.h1`
    margin-bottom: 32px;
    color: #333;
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 1px;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(135deg, #043C70 0%, #0056a3 100%);
        border-radius: 2px;
    }

    @media screen and (max-width: 400px) {
        font-size: 24px;
        margin-bottom: 28px;
    }
`

export const FormLabel = styled.label`
    margin-bottom: 8px;
    font-size: 14px;
    color: #fff;
`

export const FormInput = styled.input`
    /* Estilos movidos para dentro do Form component */
`

export const FormButton = styled.button`
    /* Estilos movidos para dentro do Form component */
`

export const Text = styled.span`
    text-align: center;
    margin-top: 24px;
    color: #fff;
    font-size: 14px;
`

export const LoginButton = styled(Link)`
    text-align: center;
    margin-top: 24px;
    color: #fff;
    font-size: 14px;
`

export const BackButton = styled.button`
    background: none;
    border: none;
    font-family: inherit;
    text-decoration: none;
    display: inline-block;
    
    &[href] {
        cursor: pointer;
    }
`

export const ForgetButton = styled(Link)`
    text-align: center;
    margin-top: 24px;
    color: #fff;
    font-size: 14px;
`

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centraliza verticalmente */
  min-height: 100vh;
`;

