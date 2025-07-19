// Funções utilitárias comuns

/**
 * Formata uma data para exibição
 * @param {string} dateString - String de data no formato ISO
 * @returns {string} Data formatada
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

/**
 * Trunca um texto para um tamanho específico
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Gera um slug a partir de um texto
 * @param {string} text - Texto para gerar o slug
 * @returns {string} Slug gerado
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};