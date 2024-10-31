// /components/Articles/FutureOfSkateboarding/Index.js
import React from 'react';
import {
  ArticlesContainer,
  ArticlesTitle,
  ArticleContent,
  BackButton,
} from '../ArticlesPage/ArticlesElements';
import NavbarEvents from '../NavbarEvent';
 
const FutureOfSkateboarding = () => (
    <>
    <NavbarEvents />
  <ArticlesContainer>
    <ArticlesTitle>O Futuro do Skate</ArticlesTitle>
    <ArticleContent>
      <p>O skate tem se reinventado ao longo das últimas décadas, e as próximas inovações já estão à vista. A tecnologia está trazendo novas possibilidades, com equipamentos mais leves, duráveis e sustentáveis, além de aprimorar o design de pistas para melhor performance e segurança dos skatistas.</p>
     
      <p>Uma das áreas de destaque é o uso de materiais como o grafeno e fibra de carbono na fabricação de skates, oferecendo resistência e flexibilidade sem comprometer a leveza. Skates elétricos também estão ganhando espaço, promovendo uma experiência única e expandindo as opções de mobilidade urbana para os skatistas.</p>
     
      <p>No mundo das competições, o skate se consolidou como um esporte olímpico, aumentando sua visibilidade e atraindo um público mais diverso. Esse crescimento impulsiona o surgimento de eventos inclusivos e competições acessíveis para skatistas de todos os níveis, promovendo a representatividade e inspirando novas gerações.</p>
 
      <p>Além disso, as novas pistas de skate estão sendo projetadas com foco em sustentabilidade e acessibilidade. Muitas cidades estão investindo em parques urbanos que integram a prática do skate ao ambiente, usando materiais ecológicos e tecnologias de captação de energia renovável. O futuro do skate promete trazer ainda mais inovação e oportunidades para quem ama o esporte!</p>
 
      <BackButton to="/articles">Voltar</BackButton>
    </ArticleContent>
  </ArticlesContainer>
  </>
);
 
export default FutureOfSkateboarding;