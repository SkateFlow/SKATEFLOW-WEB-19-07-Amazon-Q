import React, { useEffect, useState } from 'react';
import {
  ArticlesContainer,
  ArticlesWrapper,
  ArticlesTitle,
  ArticleCard,
  ArticleIcon,
  ArticleHeading,
  ArticleDescription,
} from './ArticlesElements';
import NavbarEvents from '../NavbarEvent';
import ArticleForm from './ArticleForm'; // Importando ArticleForm
import { getArtigos, deleteArtigo } from '../../services/articleService'; // Ajuste o caminho conforme necessário
import Icon1 from '../../images/news.svg'; // Certifique-se de importar ícones

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState({ id: null, title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchArticles = async () => {
    const data = await getArtigos();
    setArticles(data);
  };

  const handleEdit = (artigo) => {
    setArticle(artigo);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await deleteArtigo(id);
    fetchArticles();
  };

  useEffect(() => {
    let isMounted = true; // variável de controle

    const fetchArticles = async () => {
      const data = await getArtigos();
      if (isMounted) setArticles(data); // atualiza o estado apenas se o componente estiver montado
    };

    fetchArticles();

    return () => {
      isMounted = false; // define como desmontado
    };
  }, []);

  return (
    <>
      <NavbarEvents />
      <ArticlesContainer>
        <ArticlesTitle>Artigos</ArticlesTitle>
        <ArticleForm
          fetchArticles={fetchArticles}
          article={article}
          setArticle={setArticle}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
        <ArticlesWrapper>
          {articles.map((artigo) => (
            <ArticleCard key={artigo.id}>
              <ArticleIcon src={Icon1} alt="Artigo" />
              <ArticleHeading>{artigo.title}</ArticleHeading>
              <ArticleDescription>{artigo.description}</ArticleDescription>
              <button onClick={() => handleEdit(artigo)}>Editar</button>
              <button onClick={() => handleDelete(artigo.id)}>Deletar</button>
            </ArticleCard>
          ))}
        </ArticlesWrapper>
      </ArticlesContainer>
    </>
  );
};

export default ArticlesPage;
