import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ButtonGroup,
  SaveButton,
  CancelButton
} from '../EditPistaModal/EditPistaModalElements';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <ModalOverlay 
          style={{ zIndex: 1001 }}
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <ModalContainer 
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ 
              maxWidth: '400px',
              padding: '24px',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader style={{ borderBottom: 'none', paddingBottom: '0' }}>
              <ModalTitle style={{ fontSize: '18px' }}>{title}</ModalTitle>
            </ModalHeader>
            
            <div style={{ 
              padding: '20px 0',
              color: '#64748b',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {message}
            </div>
            
            <ButtonGroup>
              <CancelButton 
                onClick={onClose}
                style={{ flex: 1 }}
              >
                Cancelar
              </CancelButton>
              <SaveButton 
                onClick={onConfirm}
                style={{ flex: 1, background: '#dc2626' }}
              >
                Excluir
              </SaveButton>
            </ButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;