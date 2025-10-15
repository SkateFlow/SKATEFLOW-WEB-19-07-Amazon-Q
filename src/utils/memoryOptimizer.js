// Utilitário para otimização de memória
export const memoryOptimizer = {
  // Limpar cache de imagens não utilizadas
  clearImageCache: () => {
    if (typeof window !== 'undefined') {
      // Limpar URLs de blob não utilizadas
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }
      });
    }
  },

  // Debounce para evitar múltiplas chamadas
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle para limitar frequência de execução
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Limpar listeners de eventos não utilizados
  cleanupEventListeners: (element) => {
    if (element && element.cloneNode) {
      const newElement = element.cloneNode(true);
      element.parentNode?.replaceChild(newElement, element);
      return newElement;
    }
    return element;
  }
};