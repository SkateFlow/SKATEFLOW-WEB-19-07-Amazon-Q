import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getArtigos, createArtigo, updateArtigo, deleteArtigo } from '../../services/articleService'; // Atualize o caminho se necessário
import { Form } from '../../LoginPage/LoginElements';
import SidebarAdmin from '../SidebarAdmin';

const AdminContainerArtigos = styled.div`
  display: flex;
  background-color: white;
  color: black;
  min-height: 100vh;
`;

const ContentContainerArtigos = styled.div`
  padding: 50px;
  padding-left: 300px;
  flex-grow: 1;
  text-align: center;
`;

const StyledFormArtigos = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledInputArtigo = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StyledTextareaArtigo = styled.textarea`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const SubmitButtonArtigo = styled.button`
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ArticleListContainer = styled.div`
  margin-top: 20px; // Espaçamento acima
  margin-bottom: 30px; // Espaçamento entre a lista e o formulário
`;

const StyledTableArtigos = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledThArtigo = styled.th`
  padding: 15px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const StyledTdArtigo = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  background-color: ${({ index }) => (index % 2 === 0 ? '#f3f3f3' : '#ffffff')};

  &:hover {
    background-color: #e0f7fa;
  }
`;

const ActionButtonArtigo = styled.button`
  margin: 0 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &.edit {
    background-color: #ffc107;

    &:hover {
      background-color: #e0a800;
    }
  }

  &.delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const ArticleAdminPage = () => {
  const [artigo, setArtigo] = useState({ id: null, titulo: '', conteudo: '' });
  const [isEditingArtigo, setIsEditingArtigo] = useState(false);
  const [artigos, setArtigos] = useState([]);

  useEffect(() => {
    fetchArtigos();
  }, []);

  const fetchArtigos = async () => {
    const data = await getArtigos();
    setArtigos(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtigo({ ...artigo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditingArtigo) {
      await updateArtigo(artigo);
    } else {
      await createArtigo(artigo);
    }
    resetForm();
    fetchArtigos();
  };

  const handleEdit = (artigoToEdit) => {
    setArtigo(artigoToEdit);
    setIsEditingArtigo(true);
  };

  const handleDelete = async (artigoId) => {
    await deleteArtigo(artigoId);
    fetchArtigos();
  };

  const resetForm = () => {
    setArtigo({ id: null, titulo: '', conteudo: '' });
    setIsEditingArtigo(false);
  };

  return (
    <AdminContainerArtigos>
      <SidebarAdmin />
      <ContentContainerArtigos>
        <ArticleListContainer>
          <StyledTableArtigos>
            <thead>
              <tr>
                <StyledThArtigo>Título</StyledThArtigo>
                <StyledThArtigo>Conteúdo</StyledThArtigo>
                <StyledThArtigo>Ações</StyledThArtigo>
              </tr>
            </thead>
            <tbody>
              {artigos.map((artigo, index) => (
                <tr key={artigo.id}>
                  <StyledTdArtigo index={index}>{artigo.titulo}</StyledTdArtigo>
                  <StyledTdArtigo index={index}>{artigo.conteudo}</StyledTdArtigo>
                  <StyledTdArtigo index={index}>
                    <ActionButtonArtigo onClick={() => handleEdit(artigo)} className="edit">
                      Editar
                    </ActionButtonArtigo>
                    <ActionButtonArtigo onClick={() => handleDelete(artigo.id)} className="delete">
                      Excluir
                    </ActionButtonArtigo>
                  </StyledTdArtigo>
                </tr>
              ))}
            </tbody>
          </StyledTableArtigos>
        </ArticleListContainer>

        <StyledFormArtigos onSubmit={handleSubmit}>
          <StyledInputArtigo
            type="text"
            name="titulo"
            value={artigo.titulo}
            onChange={handleInputChange}
            placeholder="Título do Artigo"
            required
          />
          <StyledTextareaArtigo
            name="conteudo"
            value={artigo.conteudo}
            onChange={handleInputChange}
            placeholder="Conteúdo do Artigo"
            required
            rows="4"
          />
          <SubmitButtonArtigo type="submit">{isEditingArtigo ? 'Atualizar' : 'Criar'} Artigo</SubmitButtonArtigo>
        </StyledFormArtigos>
      </ContentContainerArtigos>
    </AdminContainerArtigos>
  );
};

export default ArticleAdminPage;
