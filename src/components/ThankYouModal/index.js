import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ThankYouModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10006;
`;

const ThankYouContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  max-width: 400px;
`;

const ThankYouTitle = styled.h3`
  color: #1a237e;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
`;

const ThankYouText = styled.p`
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const UnderstandButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #1a237e 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const ThankYouModalComponent = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <ThankYouModal 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ThankYouContent 
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <ThankYouTitle>Obrigado pela avaliação!</ThankYouTitle>
            <ThankYouText>
              Sua opinião é muito importante para ajudar outros skatistas a encontrarem as melhores pistas.
            </ThankYouText>
            <UnderstandButton onClick={onClose}>
              Entendi
            </UnderstandButton>
          </ThankYouContent>
        </ThankYouModal>
      )}
    </AnimatePresence>
  );
};

export default ThankYouModalComponent;