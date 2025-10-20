import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  SaveButton
} from '../EditPistaModal/EditPistaModalElements';

const EventRequestConfirmModal = ({ isOpen, onClose, isOrganizer }) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <ModalOverlay 
          style={{ zIndex: 1002 }}
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
              padding: '32px 24px',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <FiCheckCircle 
                size={48} 
                color="#10b981"
                style={{
                  background: '#ecfdf5',
                  borderRadius: '50%',
                  padding: '12px'
                }}
              />
            </div>
            
            <ModalHeader style={{ borderBottom: 'none', paddingBottom: '0' }}>
              <ModalTitle style={{ fontSize: '20px', color: '#1f2937' }}>
                {isOrganizer ? 'Evento Cadastrado!' : 'Solicitação Enviada!'}
              </ModalTitle>
            </ModalHeader>
            
            <div style={{ 
              padding: '16px 0 24px',
              color: '#64748b',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {isOrganizer 
                ? 'Seu evento foi cadastrado com sucesso e já está disponível para visualização.'
                : 'Sua solicitação de evento foi enviada para o sistema e está sendo analisada. Você receberá uma notificação quando ela for aprovada ou se houver alguma observação.'
              }
            </div>
            
            <SaveButton 
              onClick={onClose}
              style={{ 
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #1a237e 100%)',
                border: 'none'
              }}
            >
              Entendi
            </SaveButton>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default EventRequestConfirmModal;