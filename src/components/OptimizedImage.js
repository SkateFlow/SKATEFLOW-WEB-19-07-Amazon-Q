import React, { useState } from 'react';
import { convertBase64ToDataUrl } from '../utils/imageUtils';

const OptimizedImage = ({ 
  src, 
  alt, 
  style, 
  onError, 
  fallbackSrc = null,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(() => {
    if (!src) return fallbackSrc;
    
    // Se é uma URL HTTP, usa diretamente
    if (src.startsWith('http')) {
      return src;
    }
    
    // Se é base64, converte para data URL
    return convertBase64ToDataUrl(src);
  });
  
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    } else if (onError) {
      onError();
    }
  };

  if (!imageSrc || hasError) {
    return (
      <div 
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f7fafc',
          color: '#a0aec0',
          fontSize: '14px'
        }}
      >
        Imagem não disponível
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      style={style}
      onError={handleError}
      {...props}
    />
  );
};

export default OptimizedImage;