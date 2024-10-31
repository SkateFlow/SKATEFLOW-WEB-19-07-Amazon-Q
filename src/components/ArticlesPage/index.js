import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArticlesContainer, // mantém
  ArticlesWrapper, // mantém
  ArticlesTitle, // mantém
  ArticleCard, // mantém
  ArticleIcon, // mantém
  ArticleHeading, // mantém
  ArticleDescription, // mantém
} from './ArticlesElements';
import NavbarEvents from '../NavbarEvent';
 
import Icon1 from '../../images/news.svg';
import Icon2 from '../../images/ph.svg';
import Icon3 from '../../images/logo2.svg';
 
const ArticlesPage = () => {
  return (
    <>
    <NavbarEvents />
    <ArticlesContainer>
      
      <ArticlesTitle>Artigos</ArticlesTitle>
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
    </ArticlesContainer>
    </>
  );
};
 
export default ArticlesPage;
 