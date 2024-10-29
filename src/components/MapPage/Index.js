import React from 'react';
import { Container, MapWrap, Icon, FormContent, FormH1, Map,  } from './MapPageElements';
import { Button } from '../ButtonElement'

const MapPage = () => {
  return (
    <Container>
      <MapWrap>
        <Icon to="/">SkateFlow</Icon>
        <FormContent>
          <FormH1>Pistas de Skate no Mapa</FormH1>
          <Map>
            <iframe
              title="Mapa de Pistas de Skate em São Paulo"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d82751.09276178555!2d-46.68219822122801!3d-23.564270587934733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1spista%20de%20skate%20s%C3%A3o%20paulo!5e0!3m2!1spt-BR!2sbr!4v1726882531768!5m2!1spt-BR!2sbr"
              width="100%" height="450" style={{ border: 0 }} allowFullScreen="" loading="fast"
            ></iframe>
          </Map>
          <Button 
              to="/"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-80}
              primary={1} 
              dark={0}
          > Voltar </Button>
        
        </FormContent>
      </MapWrap>
    </Container>
  );
};

export default MapPage;
