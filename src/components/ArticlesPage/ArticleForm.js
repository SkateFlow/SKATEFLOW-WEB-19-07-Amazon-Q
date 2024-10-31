import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createArtigo, updateArtigo } from '../../services/articleService';

const StyledForm = styled.form`
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

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
`;

const ArticleForm = ({ fetchArticles, article, setArticle, isEditing, setIsEditing }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateArtigo(article);
    } else {
      await createArtigo(article);
    }
    resetForm();
    fetchArticles();
  };

  const resetForm = () => {
    setArticle({ id: null, title: '', description: '' }); // Ajuste conforme seu modelo de dados
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && article) {
      setArticle(article);
    }
  }, [isEditing, article, setArticle]);

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledInput
        type="text"
        name="title"
        value={article.title}
        onChange={handleInputChange}
        placeholder="Título do Artigo"
        required
      />
      <StyledInput
        type="text"
        name="description"
        value={article.description}
        onChange={handleInputChange}
        placeholder="Descrição do Artigo"
        required
      />
      <SubmitButton type="submit">{isEditing ? 'Atualizar' : 'Criar'} Artigo</SubmitButton>
    </StyledForm>
  );
};

export default ArticleForm;
