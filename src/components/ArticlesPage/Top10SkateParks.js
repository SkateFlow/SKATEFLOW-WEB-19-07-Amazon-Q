import React from 'react';
import {
  ArticlesContainer,
  ArticlesTitle,
  ArticleContent,
  BackButton,
} from '../ArticlesPage/ArticlesElements';
import NavbarEvents from '../NavbarEvent';
 
const Top10SkateParks = () => (
    <>
    <NavbarEvents />
  <ArticlesContainer>
    <ArticlesTitle>Top 10 Pistas de Skate da América Latina</ArticlesTitle>
    <ArticleContent>
      <p>Preparamos uma lista das melhores pistas de skate da América Latina, com base nas avaliações de skatistas locais. Essas pistas são reconhecidas por seus designs incríveis e pela infraestrutura de qualidade, proporcionando experiências únicas para todos os níveis de habilidade.</p>
      <p>Descubra onde encontrar as rampas mais desafiadoras e os bowls mais famosos para aprimorar suas manobras.</p>
      <ul>
        <li><strong>Praça Roosevelt - São Paulo, Brasil</strong> - Obstáculos variados e amplos para todos os níveis.</li>
        <li><strong>Skatepark de Costanera Sur - Buenos Aires, Argentina</strong> - Bowls profundos e transições rápidas ao lado do rio.</li>
        <li><strong>La Carolina - Quito, Equador</strong> - Rampas e obstáculos em um parque que mistura natureza e skate.</li>
        <li><strong>Skatepark de Bogotá - Bogotá, Colômbia</strong> - Grande área de street e freestyle, atraindo skatistas de todos os níveis.</li>
        <li><strong>Parque de Los Reyes - Santiago, Chile</strong> - Bowls e street bem projetados, um ponto popular em Santiago.</li>
        <li><strong>Parque de La Democracia - San José, Costa Rica</strong> - Rampas variadas em um ambiente acolhedor.</li>
        <li><strong>Los Conejos - Lima, Peru</strong> - Comunidade acolhedora e rampas rápidas.</li>
        <li><strong>Skatepark da Orla - Salvador, Brasil</strong> - Vista para o mar e rampas desafiadoras em Salvador.</li>
        <li><strong>Parque Kennedy - Lima, Peru</strong> - Popular entre skatistas locais com área extensa.</li>
        <li><strong>Vans Skatepark - Cidade do México, México</strong> - Design estiloso e localização central para campeonatos.</li>
      </ul>
      <BackButton to="/articles">Voltar</BackButton>
    </ArticleContent>
  </ArticlesContainer>
  </>
);
 
export default Top10SkateParks;