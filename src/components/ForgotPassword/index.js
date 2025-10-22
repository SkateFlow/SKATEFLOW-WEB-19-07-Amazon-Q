import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, Form, FormH1, FormInput, FormButton, BackButton } from '../../LoginPage/LoginElements';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../../services/usuarioService';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logoWhite from '../../assets/images/logoof1.svg';
import styled from 'styled-components';

const FieldError = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
`;

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: código, 3: nova senha
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    const errors = {};
    if (!email) errors.email = 'Email é obrigatório';
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {

      await usuarioService.esqueceuSenha(email);
      setSuccessMessage('Código enviado para seu email!');
      setTimeout(() => {
        setStep(2);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : 'Email não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleValidarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    const errors = {};
    if (!codigo) errors.codigo = 'Código é obrigatório';
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {

      await usuarioService.validarCodigo(email, codigo);
      setSuccessMessage('Código válido!');
      setTimeout(() => {
        setStep(3);
        setSuccessMessage('');
      }, 1500);
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : 'Código inválido ou expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    const errors = {};
    if (!novaSenha) errors.novaSenha = 'Nova senha é obrigatória';
    if (!confirmarSenha) errors.confirmarSenha = 'Confirmação de senha é obrigatória';
    
    if (novaSenha && novaSenha.length < 8) {
      errors.novaSenha = 'Senha deve ter pelo menos 8 caracteres';
    }
    if (novaSenha && !/[A-Z]/.test(novaSenha)) {
      errors.novaSenha = 'Senha deve ter pelo menos 1 letra maiúscula';
    }
    if (novaSenha && !/[0-9]/.test(novaSenha)) {
      errors.novaSenha = 'Senha deve ter pelo menos 1 número';
    }
    if (novaSenha && confirmarSenha && novaSenha !== confirmarSenha) {
      errors.confirmarSenha = 'Senhas não coincidem';
    }
    
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {

      await usuarioService.redefinirSenha(email, codigo, novaSenha);
      setSuccessMessage('Senha redefinida com sucesso!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Form onSubmit={handleEnviarCodigo} autoComplete="off" className="login-form">
            <FormH1>ESQUECEU A SENHA?</FormH1>
            
            <div className="input-group">
              <FormInput
                type="email"
                placeholder="Digite seu email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="form-input"
                style={{ borderBottomColor: fieldErrors.email ? '#f44336' : '#e0e0e0' }}
              />
              {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
            </div>

            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <p>{successMessage}</p>
              </div>
            )}

            <FormButton type="submit" disabled={loading} className="submit-button">
              {loading ? 'Enviando...' : 'Enviar Código'}
            </FormButton>

            <div className="form-links">
              <BackButton 
                onClick={() => navigate('/login')} 
                className="toggle-button"
              >
                Voltar ao Login
              </BackButton>
            </div>
          </Form>
        );

      case 2:
        return (
          <Form onSubmit={handleValidarCodigo} autoComplete="off" className="login-form">
            <FormH1>DIGITE O CÓDIGO</FormH1>
            
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '14px' }}>
              Enviamos um código de 5 dígitos para<br />
              <strong>{email}</strong>
            </p>

            <div className="input-group">
              <FormInput
                type="text"
                placeholder="Digite o código (5 dígitos)"
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                autoComplete="off"
                className="form-input"
                maxLength="5"
                style={{ borderBottomColor: fieldErrors.codigo ? '#f44336' : '#e0e0e0' }}
              />
              {fieldErrors.codigo && <FieldError>{fieldErrors.codigo}</FieldError>}
            </div>

            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <p>{successMessage}</p>
              </div>
            )}

            <FormButton type="submit" disabled={loading} className="submit-button">
              {loading ? 'Validando...' : 'Validar Código'}
            </FormButton>

            <div className="form-links">
              <BackButton 
                onClick={() => setStep(1)} 
                className="toggle-button"
              >
                Voltar
              </BackButton>
              <BackButton 
                onClick={() => navigate('/login')} 
                className="toggle-button"
              >
                Cancelar
              </BackButton>
            </div>
          </Form>
        );

      case 3:
        return (
          <Form onSubmit={handleRedefinirSenha} autoComplete="off" className="login-form">
            <FormH1>NOVA SENHA</FormH1>

            <div className="input-group password-group">
              <FormInput
                type={showPassword ? "text" : "password"}
                placeholder="Nova senha"
                required
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                autoComplete="new-password"
                className="form-input password-input"
                style={{ borderBottomColor: fieldErrors.novaSenha ? '#f44336' : '#e0e0e0' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {fieldErrors.novaSenha && <FieldError>{fieldErrors.novaSenha}</FieldError>}
            </div>

            <div className="input-group password-group">
              <FormInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar nova senha"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                autoComplete="new-password"
                className="form-input password-input"
                style={{ borderBottomColor: fieldErrors.confirmarSenha ? '#f44336' : '#e0e0e0' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {fieldErrors.confirmarSenha && <FieldError>{fieldErrors.confirmarSenha}</FieldError>}
            </div>

            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <p>{successMessage}</p>
              </div>
            )}

            <FormButton type="submit" disabled={loading} className="submit-button">
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </FormButton>

            <div className="form-links">
              <BackButton 
                onClick={() => navigate('/login')} 
                className="toggle-button"
              >
                Cancelar
              </BackButton>
            </div>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      {/* Logo branca centralizada */}
      <div style={{ 
        position: 'absolute',
        top: '3%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <Icon to="/">
          <img 
            src={logoWhite} 
            alt="SkateFlow" 
            className="login-logo"
            style={{ height: '120px', width: 'auto' }} 
          />
        </Icon>
      </div>

      {/* Formulário centralizado */}
      <FormWrap>
        <FormContent>
          {renderStep()}
        </FormContent>
      </FormWrap>
    </Container>
  );
};

export default ForgotPassword;