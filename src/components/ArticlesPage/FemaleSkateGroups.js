import React from 'react';
import {
  ArticlesContainer,
  ArticlesTitle,
  ArticleContent,
  BackButton,
} from '../ArticlesPage/ArticlesElements';
import NavbarEvents from '../NavbarEvent';
 
const FemaleSkateGroups = () => (
    <>
    <NavbarEvents />
  <ArticlesContainer>
    
    <ArticlesTitle>Grupos femininos de skate que você deve conhecer</ArticlesTitle>
    <ArticleContent>
      <p>Os grupos femininos de skate têm crescido cada vez mais, promovendo inclusão e representatividade no esporte. Esses grupos são formados por mulheres que compartilham a paixão pelo skate e se apoiam mutuamente, fortalecendo a presença feminina nas pistas.</p>
      <p>Aqui, você conhecerá alguns dos grupos mais inspiradores, que estão mudando o cenário do skate e incentivando novas gerações a participarem desse movimento.</p>
      <ul>
        <li><strong>Longboard Girls Crew (LGC)</strong> - Um grupo global dedicado ao longboard, promovendo a inclusão feminina e organizando eventos ao redor do mundo.</li>
        <li><strong>As Catraias - Brasil</strong> - Este grupo brasileiro empodera mulheres através do skate, criando um ambiente de apoio e incentivo.</li>
        <li><strong>Chilenskate - Chile</strong> - Coletivo chileno que promove a inclusão feminina nas pistas e realiza eventos para a comunidade.</li>
        <li><strong>Villa Villa Cola - Argentina</strong> - Grupo argentino que se inspira no skate de rua, apoiando e representando mulheres skatistas.</li>
        <li><strong>Skate Like a Girl</strong> - Com presença internacional, conecta e fortalece mulheres no skate, inspirando jovens a ingressarem no esporte.</li>
      </ul>
      <BackButton to="/articles">Voltar</BackButton>
    </ArticleContent>
  </ArticlesContainer>
  </>
);
 
export default FemaleSkateGroups;