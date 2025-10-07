// Utilitários para conversão de imagens

// Converte imagem para PNG em base64 para salvar no sistema
export const convertImageToPngBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngDataUrl = canvas.toDataURL('image/png', 0.9);
      // Remove o prefixo data:image/png;base64, para salvar apenas o base64
      const base64String = pngDataUrl.split(',')[1];
      resolve(base64String);
    };
    
    img.onerror = () => {
      reject(new Error('Erro ao processar imagem'));
    };
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// Converte base64 de volta para data URL para exibir no frontend
export const convertBase64ToDataUrl = (base64String) => {
  if (!base64String) return '';
  
  // Se já é uma data URL completa, retorna como está
  if (base64String.startsWith('data:')) {
    return base64String;
  }
  
  // Adiciona o prefixo para criar uma data URL válida
  return `data:image/png;base64,${base64String}`;
};

// Processa array de imagens para salvar no sistema
export const processImagesForSave = async (fotosArray) => {
  const processedImages = [];
  
  for (const foto of fotosArray) {
    if (foto && foto !== '') {
      // Se já é base64 puro, mantém como está
      if (!foto.startsWith('data:')) {
        processedImages.push(foto);
      } else {
        // Se é data URL, extrai apenas o base64
        const base64String = foto.split(',')[1];
        processedImages.push(base64String);
      }
    } else {
      processedImages.push('');
    }
  }
  
  return processedImages;
};

// Processa array de imagens para exibir no frontend
export const processImagesForDisplay = (fotosArray) => {
  return fotosArray.map(foto => convertBase64ToDataUrl(foto));
};