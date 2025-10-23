// Utilitário para otimizar imagens antes do upload
export const optimizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular novas dimensões mantendo proporção
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height);
      
      // Converter para base64 com qualidade reduzida
      const optimizedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(optimizedBase64.split(',')[1]); // Retorna apenas a parte base64
    };
    
    img.src = file;
  });
};

export const validateImageSize = (base64String, maxSizeKB = 500) => {
  // Calcular tamanho aproximado em KB
  const sizeInBytes = (base64String.length * 3) / 4;
  const sizeInKB = sizeInBytes / 1024;
  
  return sizeInKB <= maxSizeKB;
};

export const compressBase64Image = async (base64String, targetSizeKB = 300) => {
  if (!base64String) return null;
  
  // Se já está no tamanho adequado, retorna como está
  if (validateImageSize(base64String, targetSizeKB)) {
    return base64String;
  }
  
  // Criar data URL completa se necessário
  const dataUrl = base64String.startsWith('data:') 
    ? base64String 
    : `data:image/jpeg;base64,${base64String}`;
  
  // Comprimir imagem
  const compressed = await optimizeImage(dataUrl, 600, 450, 0.7);
  
  // Verificar se ainda está muito grande
  if (!validateImageSize(compressed, targetSizeKB)) {
    // Comprimir mais agressivamente
    return await optimizeImage(dataUrl, 400, 300, 0.5);
  }
  
  return compressed;
};