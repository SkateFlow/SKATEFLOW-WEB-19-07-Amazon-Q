import React from 'react';
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
 
// Ícones das imagens - altere para os caminhos reais se forem diferentes
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
        <ArticleCard>
          <ArticleIcon src={Icon1} alt="Notícias Skate" />
          <ArticleHeading>Skateflow News</ArticleHeading>
          <ArticleDescription>Notícias do mundo do skate.</ArticleDescription>
        </ArticleCard>
        <ArticleCard>
          <ArticleIcon src={Icon2} alt="Top 10 Pistas" />
          <ArticleHeading>Top 10 Pistas de Skate da América Latina</ArticleHeading>
          <ArticleDescription>Avaliadas por vocês!</ArticleDescription>
        </ArticleCard>
        <ArticleCard>
          <ArticleIcon src={Icon3} alt="Grupos femininos" />
          <ArticleHeading>Grupos femininos de skate que você deve conhecer</ArticleHeading>
          <ArticleDescription>Esses grupos crescem mais e mais!</ArticleDescription>
        </ArticleCard>
      </ArticlesWrapper>
    </ArticlesContainer>
    </>
  );
}
 
export default ArticlesPage;
 
 