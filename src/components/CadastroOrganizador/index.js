import React, { useState } from 'react';
import { Container, FormWrap, Icon, FormContent, FormH1, BackButton } from '../../LoginPage/LoginElements';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logoWhite from '../../assets/images/logoof1.svg';
import styled from 'styled-components';
import { usuarioService } from '../../services/usuarioService';
import { organizadorService } from '../../services/organizadorService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 160px;
  z-index: 9999;
  
  @media (max-width: 400px) {
    padding-top: 140px;
  }
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  width: 90%;
  max-width: 800px;
  height: 70vh;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 40px 40px 40px;
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const ModalTitle = styled.h1`
  color: #333;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ModalSubtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const FormSection = styled.div`
  .section-title {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 2px solid #043C70;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const FormInput = styled.input`
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
  }
`;

const PasswordToggle = styled.button`
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

  &:hover {
    color: #043C70;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #043C70 0%, #0056a3 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 24px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(4, 60, 112, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  text-align: center;
  color: #d32f2f;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  text-align: center;
  color: #388e3c;
  font-size: 14px;
`;

const CadastroOrganizador = () => {
  const [formData, setFormData] = useState({
    // Dados do usuário
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    // Dados do organizador
    nomeOrganizador: '',
    cpf_cnpj: '',
    dataNascimento: '',
    telefone: '',
    logradouro: '',
    numResidencia: '',
    cep: '',
    bairro: '',
    cidade: '',
    uf: '',
    complemento: ''
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    // Validação e formatação para campos numéricos
    if (field === 'telefone') {
      const numbers = value.replace(/\D/g, '').slice(0, 11);
      if (numbers.length <= 2) {
        value = numbers.replace(/(\d{1,2})/, '($1');
      } else if (numbers.length <= 7) {
        value = numbers.replace(/(\d{2})(\d{1,5})/, '($1) $2');
      } else if (numbers.length <= 10) {
        value = numbers.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
      } else {
        value = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    } else if (field === 'cep') {
      const numbers = value.replace(/\D/g, '').slice(0, 8);
      value = numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    } else if (field === 'cpf_cnpj') {
      const numbers = value.replace(/\D/g, '').slice(0, 14);
      if (numbers.length <= 11) {
        value = numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                      .replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
                      .replace(/(\d{3})(\d{1,3})/, '$1.$2');
      } else {
        value = numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
                      .replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4')
                      .replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3')
                      .replace(/(\d{2})(\d{1,3})/, '$1.$2');
      }
    } else if (field === 'numResidencia') {
      value = value.replace(/\D/g, '').slice(0, 6);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const buscarEnderecoPorCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            uf: data.uf || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validações
      if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha ||
          !formData.nomeOrganizador || !formData.cpf_cnpj || !formData.telefone || !formData.cep ||
          !formData.dataNascimento) {
        setErrorMessage('Preencha todos os campos obrigatórios');
        return;
      }

      // Validar tamanhos dos campos
      if (formData.nome.length > 200) {
        setErrorMessage('Nome deve ter no máximo 200 caracteres');
        return;
      }

      if (formData.email.length > 200) {
        setErrorMessage('Email deve ter no máximo 200 caracteres');
        return;
      }

      if (formData.nomeOrganizador.length > 200) {
        setErrorMessage('Nome do organizador deve ter no máximo 200 caracteres');
        return;
      }

      // Validar idade (maior de 18 anos)
      const hoje = new Date();
      const nascimento = new Date(formData.dataNascimento);
      const idade = hoje.getFullYear() - nascimento.getFullYear();
      const mesAtual = hoje.getMonth();
      const diaAtual = hoje.getDate();
      const mesNascimento = nascimento.getMonth();
      const diaNascimento = nascimento.getDate();
      
      let idadeReal = idade;
      if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        idadeReal--;
      }
      
      if (idadeReal < 18) {
        setErrorMessage('Apenas maiores de 18 anos podem se cadastrar como organizador');
        return;
      }

      // Validar CPF/CNPJ (formato básico)
      const cpfCnpjLimpo = formData.cpf_cnpj.replace(/\D/g, '');
      if (cpfCnpjLimpo.length !== 11 && cpfCnpjLimpo.length !== 14) {
        setErrorMessage('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos');
        return;
      }

      if (formData.senha.length < 8) {
        setErrorMessage('Senha deve ter pelo menos 8 caracteres');
        return;
      }

      if (!/[A-Z]/.test(formData.senha)) {
        setErrorMessage('Senha deve ter pelo menos 1 letra maiúscula');
        return;
      }

      if (!/[0-9]/.test(formData.senha)) {
        setErrorMessage('Senha deve ter pelo menos 1 número');
        return;
      }

      if (formData.senha !== formData.confirmarSenha) {
        setErrorMessage('Senhas não coincidem');
        return;
      }

      // 1. Criar usuário primeiro com nível ORGANIZADOR
      const usuarioData = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha,
        nivelAcesso: 'ORGANIZADOR'
      };
      
      await usuarioService.cadastrar(usuarioData);
      
      // 2. Buscar o usuário criado pelo email para obter o ID
      const usuarioLogado = await usuarioService.login(formData.email, formData.senha);
      
      // 3. Criar organizador vinculado ao usuário
      const organizadorData = {
        nome: formData.nomeOrganizador,
        cpf_cnpj: formData.cpf_cnpj.replace(/\D/g, ''),
        dataNascimento: formData.dataNascimento || null,
        telefone: formData.telefone,
        email: formData.email,
        logradouro: formData.logradouro || null,
        numResidencia: formData.numResidencia || null,
        cep: formData.cep,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        uf: formData.uf || null,
        complemento: formData.complemento || null,
        statusOrganizador: 'ATIVO',
        usuario_id: usuarioLogado
      };
      
      await organizadorService.criar(organizadorData);
      
      setSuccessMessage('Cadastro de organizador realizado com sucesso!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setErrorMessage(typeof error === 'string' ? error : 'Erro no cadastro');
    } finally {
      setLoading(false);
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
        zIndex: 10000
      }}>
        <Icon to="/">
          <img 
            src={logoWhite} 
            alt="SkateFlow" 
            style={{ height: '120px', width: 'auto' }} 
          />
        </Icon>
      </div>

      <ModalOverlay>
        <ModalContent>
          <div style={{ padding: '40px 40px 0 40px' }}>
            <ModalHeader>
              <ModalTitle>CADASTRO DE ORGANIZADOR</ModalTitle>
              <ModalSubtitle>Preencha os dados para se tornar um organizador de eventos</ModalSubtitle>
            </ModalHeader>
          </div>

          <ScrollableContent>
            <form onSubmit={handleSubmit}>
            <FormGrid>
              {/* Coluna 1 */}
              <FormSection>
                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="Nome completo *"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha *"
                    value={formData.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar senha *"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="Nome do organizador *"
                    value={formData.nomeOrganizador}
                    onChange={(e) => handleInputChange('nomeOrganizador', e.target.value)}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="CNPJ ou CPF *"
                    value={formData.cpf_cnpj}
                    onChange={(e) => handleInputChange('cpf_cnpj', e.target.value)}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="date"
                    placeholder="Data de nascimento *"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                    required
                  />
                </InputGroup>
              </FormSection>

              {/* Coluna 2 */}
              <FormSection>
                <InputGroup>
                  <FormInput
                    type="tel"
                    placeholder="Telefone *"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    required
                  />
                </InputGroup>



                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="CEP *"
                    value={formData.cep}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange('cep', value);
                      buscarEnderecoPorCep(value);
                    }}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="Logradouro"
                    value={formData.logradouro}
                    onChange={(e) => handleInputChange('logradouro', e.target.value)}
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="Número"
                    value={formData.numResidencia}
                    onChange={(e) => handleInputChange('numResidencia', e.target.value)}
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={(e) => handleInputChange('bairro', e.target.value)}
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="Cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="UF"
                    value={formData.uf}
                    onChange={(e) => handleInputChange('uf', e.target.value)}
                    maxLength="2"
                  />
                </InputGroup>

                <InputGroup>
                  <FormInput
                    type="text"
                    placeholder="Complemento"
                    value={formData.complemento}
                    onChange={(e) => handleInputChange('complemento', e.target.value)}
                  />
                </InputGroup>
              </FormSection>
            </FormGrid>

            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Organizador'}
            </SubmitButton>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <BackButton 
                onClick={() => navigate('/login')} 
                className="toggle-button"
                style={{ color: '#043C70' }}
              >
                Voltar ao Login
              </BackButton>
            </div>
            </form>
          </ScrollableContent>
        </ModalContent>
      </ModalOverlay>
    </Container>
  );
};

export default CadastroOrganizador;