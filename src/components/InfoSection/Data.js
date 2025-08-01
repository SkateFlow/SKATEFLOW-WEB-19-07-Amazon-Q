import logomap from '../../assets/images/logomap.svg';
import placeholder from '../../assets/images/ph.svg';
import appIcon from '../../assets/images/app.svg';

export const homeObjOne = {
    id: 'about',
    lightBg: false,
    lightText: true,
    lightTextDesc: true,
    topLine: '',
    headline: 'Veja pistas ao seu redor pelo nosso mapa!',
    description: 'Pistas compartilhadas por outros usuários.',
    buttonLabel: 'Acessar',
    imgStart: false,
    img: logomap,
    alt: 'GugaAbout',
    dark: true,
    primary: true,
    darkText: false,
    linkTo: '/map', // Link para a página de mapas
};

export const homeObjTwo = {
    id: 'discover',
    lightBg: false,
    lightText: true,
    lightTextDesc: true,
    topLine: 'Acessar eventos',
    headline: 'Principais Eventos',
    description: 'Fique por dentro dos melhores eventos!',
    buttonLabel: 'Acessar',
    imgStart: true,
    img: placeholder,
    alt: 'GugaDiscover',
    dark: true,
    primary: true,
    darkText: false,
    linkTo: '/events', // Link aleatório
};

export const homeObjThree = {
    id: 'signup',
    lightBg: true,
    lightText: false,
    lightTextDesc: false,
    topLine: 'Baixe nosso aplicativo!',
    headline: 'Baixe nosso aplicativo mobile!',
    description: "Com o SkateFlow mobile, você consegue agendar seus ingressos para ir a eventos, avaliar pistas e ver suas avaliações feitas por outros usuários e muito mais!",
    buttonLabel: 'Baixar',
    imgStart: false,
    img: appIcon,
    alt: 'GugaSignUp',
    dark: false,
    primary: false,
    darkText: true,
    linkTo: 'https://www.example.com', // Outro link aleatório
};