// Serviço para buscar pistas de skate usando OpenStreetMap Overpass API
// A API mais precisa e gratuita disponível

import placeholderImage from '../assets/images/ph.svg';

export const fetchSkateParks = async () => {
  // Retornando dados fictícios para demonstração
  return getFallbackData();
};

// Dados de fallback caso a API falhe
const getFallbackData = () => [
  {
    id: 1,
    name: 'Skate Park Ibirapuera',
    description: 'Pista completa com bowls, rampas e área street no coração de São Paulo',
    location: 'Ibirapuera, São Paulo - SP',
    type: 'park',
    difficulty: 'intermediário',
    rating: 4.5,
    likes: 128,
    coordinates: { lat: -23.5875, lng: -46.6577 },
    images: [placeholderImage],
    features: ['Bowl', 'Street', 'Rampa', 'Iluminação']
  },
  {
    id: 2,
    name: 'Pista da Vila Madalena',
    description: 'Área street com obstáculos variados e ambiente descontraído',
    location: 'Vila Madalena, São Paulo - SP',
    type: 'street',
    difficulty: 'avançado',
    rating: 4.8,
    likes: 95,
    coordinates: { lat: -23.5505, lng: -46.6833 },
    images: [placeholderImage],
    features: ['Street', 'Escadas', 'Corrimão']
  },
  {
    id: 3,
    name: 'Bowl da Liberdade',
    description: 'Bowl clássico para manobras avançadas e sessões intensas',
    location: 'Liberdade, São Paulo - SP',
    type: 'bowl',
    difficulty: 'avançado',
    rating: 4.2,
    likes: 67,
    coordinates: { lat: -23.5589, lng: -46.6344 },
    images: [placeholderImage],
    features: ['Bowl', 'Vertical', 'Gratuito']
  },
  {
    id: 4,
    name: 'Pista do Memorial',
    description: 'Pista pública com mini ramp e área para iniciantes',
    location: 'Memorial da América Latina, São Paulo - SP',
    type: 'park',
    difficulty: 'iniciante',
    rating: 4.0,
    likes: 89,
    coordinates: { lat: -23.5276, lng: -46.6631 },
    images: [placeholderImage],
    features: ['Mini Ramp', 'Iniciantes', 'Gratuito']
  },
  {
    id: 5,
    name: 'Street Plaza Paulista',
    description: 'Plaza urbana com escadas, corrimãos e gaps para street skating',
    location: 'Avenida Paulista, São Paulo - SP',
    type: 'street',
    difficulty: 'intermediário',
    rating: 4.3,
    likes: 156,
    coordinates: { lat: -23.5618, lng: -46.6565 },
    images: [placeholderImage],
    features: ['Escadas', 'Gaps', 'Corrimão', 'Urbano']
  },
  {
    id: 6,
    name: 'Bowl do Pacaembu',
    description: 'Bowl profundo estilo piscina para manobras radicais',
    location: 'Pacaembu, São Paulo - SP',
    type: 'bowl',
    difficulty: 'avançado',
    rating: 4.7,
    likes: 203,
    coordinates: { lat: -23.5467, lng: -46.6658 },
    images: [placeholderImage],
    features: ['Bowl Profundo', 'Piscina', 'Vert']
  },
  {
    id: 7,
    name: 'Pista da Mooca',
    description: 'Pista comunitária com obstáculos diversos e boa iluminação',
    location: 'Mooca, São Paulo - SP',
    type: 'park',
    difficulty: 'intermediário',
    rating: 4.1,
    likes: 74,
    coordinates: { lat: -23.5663, lng: -46.5986 },
    images: [placeholderImage],
    features: ['Obstáculos', 'Iluminação', 'Comunitária']
  },
  {
    id: 8,
    name: 'Street Spot Bela Vista',
    description: 'Spot clássico com bancos de mármore e arquitetura única',
    location: 'Bela Vista, São Paulo - SP',
    type: 'street',
    difficulty: 'avançado',
    rating: 4.6,
    likes: 187,
    coordinates: { lat: -23.5587, lng: -46.6447 },
    images: [placeholderImage],
    features: ['Mármore', 'Bancos', 'Clássico']
  },
  {
    id: 9,
    name: 'Mini Ramp Santana',
    description: 'Mini ramp coberta ideal para treinos e sessões noturnas',
    location: 'Santana, São Paulo - SP',
    type: 'park',
    difficulty: 'iniciante',
    rating: 3.9,
    likes: 52,
    coordinates: { lat: -23.5089, lng: -46.6311 },
    images: [placeholderImage],
    features: ['Mini Ramp', 'Coberta', 'Noturna']
  },
  {
    id: 10,
    name: 'Bowl da Zona Sul',
    description: 'Bowl moderno com transições suaves e design inovador',
    location: 'Vila Olímpia, São Paulo - SP',
    type: 'bowl',
    difficulty: 'intermediário',
    rating: 4.4,
    likes: 112,
    coordinates: { lat: -23.5955, lng: -46.6890 },
    images: [placeholderImage],
    features: ['Moderno', 'Transições', 'Design']
  }
];

