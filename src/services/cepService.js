// Serviço para buscar endereço por CEP usando a API ViaCEP
export const cepService = {
  buscarEnderecoPorCep: async (cep) => {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      
      if (cepLimpo.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
      }

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        localidade: data.localidade,
        uf: data.uf,
        endereco: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
      };
    } catch (error) {
      throw new Error('Erro ao buscar CEP: ' + error.message);
    }
  },

  // Função para obter coordenadas aproximadas baseadas no endereço
  obterCoordenadas: async (endereco) => {
    try {
      // Usando Nominatim (OpenStreetMap) para geocoding gratuito
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }

      throw new Error('Coordenadas não encontradas para este endereço');
    } catch (error) {
      throw new Error('Erro ao obter coordenadas: ' + error.message);
    }
  }
};