//ARTIGOS

import React from 'react'
import Icon1 from '../../images/ph.svg'
import Icon2 from '../../images/news.svg'
import Icon3 from '../../images/logo2.svg'

import {
  ServicesContainer,
  ServicesH1,
  ServicesWrapper,
  ServicesCard,
  ServicesIcon,
  ServicesH2,
  ServicesP,
  BtnWrap
} from './ServicesElements'
import { Button } from '../ButtonElement'

//card muda de tamanho dependendo da quantia de caracteres

const Services = () => {
  return (
    <ServicesContainer id='services'> 
        <ServicesH1> Artigos </ServicesH1>
        <ServicesWrapper>
            <ServicesCard>
              <ServicesIcon src={Icon1}/>
              <ServicesH2> Skateflow news </ServicesH2>
              
              <ServicesP> Noticias do mundo do skate. </ServicesP>
            </ServicesCard>
            <ServicesCard>
              <ServicesIcon src={Icon2}/>
              <ServicesH2> Top 10 pistas de skates 
                da america latina </ServicesH2>
              <ServicesP> Avaliadas por vocês! </ServicesP>
            </ServicesCard>
            <ServicesCard>
              <ServicesIcon src={Icon3}/>
              <ServicesH2> Grupos femininos de skate que 
                você deve conhecer </ServicesH2>
              <ServicesP> Esses grupos crescem mais e mais!</ServicesP>
            </ServicesCard>
        </ServicesWrapper>
        <BtnWrap>
          <Button 
              to="home"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-80}
              primary={1} 
              dark={0}
          > Ver mais </Button>
        </BtnWrap>
    </ServicesContainer>
  )
}

export default Services
