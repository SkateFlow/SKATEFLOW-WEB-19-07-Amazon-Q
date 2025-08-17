import React from 'react';
import Img from '../../assets/images/inicial1.svg'; // Caminho da imagem atualizado
import shape1 from '../../assets/images/shape1.svg';
import shape2 from '../../assets/images/shape2.svg';
import FlipCard from '../FlipCard';
import {
    HeroContainer,
    HeroBg,
    HeroContent,
    HeroH1,
    HeroP
} from './HeroElements';

const HeroSection = () => {

    return (
        <HeroContainer id="home">
            <HeroBg style={{
                backgroundImage: `url(${Img})`, // Definir imagem como background
                backgroundSize: 'cover',        // Garantir que ela cubra todo o fundo
                backgroundPosition: 'bottom',   // Alinhar a parte inferior da imagem
                backgroundRepeat: 'no-repeat',  // Impedir que a imagem se repita
                width: '100%',                  // Garantir que ocupe toda a largura
                height: '100%',                 // Garantir que ocupe toda a altura
                position: 'absolute',           // Permitir sobreposição de conteúdo
                top: 0,
                left: 0
            }}>
            </HeroBg>
            <HeroContent>
                <HeroH1> Bem Vindo à SkateFlow </HeroH1>
                <HeroP>
                    Somos uma comunidade, onde você, skatista, pode encontrar outros skatistas!
                </HeroP>
                <HeroP>
                    Tenha acesso a pistas compartilhadas por usuários, veja e agende seus ingressos para eventos 
                    que estamos divulgando e leia artigos escritos por nós!
                </HeroP>

            </HeroContent>
            <div style={{
                position: 'absolute',
                right: '350px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4
            }}>
                <FlipCard 
                    imageSrc={shape1}
                    backImageSrc={shape2}
                />
            </div>
        </HeroContainer>
    );
}

export default HeroSection;