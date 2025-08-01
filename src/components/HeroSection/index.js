import React, { useState } from 'react';
import Img from '../../assets/images/fundoinicial2.svg'; // Caminho da imagem atualizado
import {
    HeroContainer,
    HeroBg,
    HeroContent,
    HeroH1,
    HeroP,
    HeroBtnWrapper,
    ArrowForward,
    ArrowRight
} from './HeroElements';

import { Button } from '../ButtonElement';

const HeroSection = () => {

    const [ hover, setHover ] = useState(false);

    const onHover = () => {
        setHover(!hover);
    }

    return (
        <HeroContainer id="home">
            <HeroBg style={{
                backgroundImage: `url(${Img})`, // Definir imagem como background
                backgroundSize: 'cover',        // Garantir que ela cubra todo o fundo
                backgroundPosition: 'center',   // Centralizar a imagem
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
                <HeroBtnWrapper>
                    <Button 
                        to="about" 
                        onMouseEnter={onHover} 
                        onMouseLeave={onHover}
                        primary="true"
                        dark="true"
                        smooth={true}
                        duration={500}
                        spy={true}
                        activeClass='active'
                        exact='true'
                    >
                        Iniciar
                        {hover ? <ArrowForward/> : <ArrowRight/>} 
                    </Button>
                </HeroBtnWrapper>
            </HeroContent>
        </HeroContainer>
    );
}

export default HeroSection;