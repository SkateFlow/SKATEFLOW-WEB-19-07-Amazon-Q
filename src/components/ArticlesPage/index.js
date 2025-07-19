import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArticlesContainer, 
  ArticlesWrapper, 
  ArticlesTitle, 
  ArticleCard, 
  ArticleIcon, 
  ArticleHeading, 
  ArticleDescription,
  Spacer, // Novo componente de espaçamento
} from './ArticlesElements';
import NavbarEvents from '../NavbarEvent';

import Icon1 from '../../assets/images/news.svg';
import Icon2 from '../../assets/images/ph.svg';
import Icon3 from '../../assets/images/logo2.svg';
import { getArtigos } from '../../services/articleService';

const ArticlesPage = () => {
  const [artigosDinamicos, setArtigosDinamicos] = useState([]);

  useEffect(() => {
    const fetchArtigos = async () => {
      const artigos = await getArtigos();
      setArtigosDinamicos(artigos);
    };

    fetchArtigos();
  }, []);

  return (
    <>
      <NavbarEvents />
      <ArticlesContainer>
        <ArticlesTitle>Artigos</ArticlesTitle>
        
        {/* Artigos fixos */}
        <ArticlesWrapper>
          <Link to="/articles/skateflow-news">
            <ArticleCard>
              <ArticleIcon src={Icon1} alt="Notícias Skate" />
              <ArticleHeading>Skateflow News</ArticleHeading>
              <ArticleDescription>Notícias do mundo do skate.</ArticleDescription>
            </ArticleCard>
          </Link>
          <Link to="/articles/top10-skateparks">
            <ArticleCard>
              <ArticleIcon src={Icon2} alt="Top 10 Pistas" />
              <ArticleHeading>Top 10 Pistas de Skate da América Latina</ArticleHeading>
              <ArticleDescription>Avaliadas por vocês!</ArticleDescription>
            </ArticleCard>
          </Link>
          <Link to="/articles/female-skate-groups">
            <ArticleCard>
              <ArticleIcon src={Icon3} alt="Grupos femininos" />
              <ArticleHeading>Grupos femininos de skate que você deve conhecer</ArticleHeading>
              <ArticleDescription>Esses grupos crescem mais e mais!</ArticleDescription>
            </ArticleCard>
          </Link>
        </ArticlesWrapper>

        {/* Espaçamento entre as seções */}
        <Spacer />

        {/* Artigos dinâmicos */}
        <ArticlesWrapper>
          {artigosDinamicos.map((artigo) => (
            <ArticleCard key={artigo.id}>
              <ArticleIcon src={Icon1} alt={artigo.titulo} />
              <ArticleHeading>{artigo.titulo}</ArticleHeading>
              <ArticleDescription>{artigo.conteudo.slice(0, 60)}...</ArticleDescription>
            </ArticleCard>
          ))}
        </ArticlesWrapper>
      </ArticlesContainer>
    </>
  );
};

export default ArticlesPage;