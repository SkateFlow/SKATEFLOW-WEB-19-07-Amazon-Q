// Serviço para buscar pistas de skate usando OpenStreetMap Overpass API
// A API mais precisa e gratuita disponível

import placeholderImage from '../assets/images/ph.svg';

export const fetchSkateParks = async () => {
  // Retornando dados fictícios para demonstração
  return getFallbackData();
};

export const getSkateparks = async () => {
  return [];
};

export const createSkatepark = async (pista) => {
  console.log('Criando pista:', pista);
  return { success: true, id: Date.now() };
};

export const updateSkatepark = async (pista) => {
  console.log('Atualizando pista:', pista);
  return { success: true };
};

export const deleteSkatepark = async (pistaId) => {
  console.log('Deletando pista:', pistaId);
  return { success: true };
};

// Dados de fallback caso a API falhe
const getFallbackData = () => [];

