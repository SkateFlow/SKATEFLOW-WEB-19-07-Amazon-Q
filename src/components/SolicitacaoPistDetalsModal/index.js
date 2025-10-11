import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  FormGrid,
  FormGroup,
  Label,
  Input,
  TextArea,
  ButtonGroup,
  SaveButton,
  CancelButton
} from '../EditPistaModal/EditPistaModalElements';
import { convertBase64ToDataUrl } from '../../utils/imageUtils';

const SolicitacaoPistDetalsModal = ({ isOpen, onClose, solicitacao, onApprove, onReject }) => {
  const [fotosProcessadas, setFotosProcessadas] = useState([]);
  const [imagemAmpliada, setImagemAmpliada] = useState(null);

  useEffect(() => {
    if (solicitacao && solicitacao.fotos) {
      const fotos = solicitacao.fotos
        .filter(foto => foto && foto.trim() !== '')
        .map(foto => convertBase64ToDataUrl(foto));
      setFotosProcessadas(fotos);
    }
  }, [solicitacao]);

  if (!solicitacao) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <ModalOverlay 
          style={{ zIndex: 1003 }}
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
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Detalhes da Solicitação</ModalTitle>
              <CloseButton onClick={onClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              {fotosProcessadas.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <Label>Fotos da Solicitação</Label>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: fotosProcessadas.length === 1 ? '1fr' : fotosProcessadas.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                    gap: '16px',
                    padding: '16px 0'
                  }}>
                    {fotosProcessadas.map((foto, index) => (
                      <img 
                        key={index}
                        src={foto} 
                        alt={`Foto ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setImagemAmpliada(foto)}
                        onError={(e) => {
                          console.error('Erro ao carregar imagem:', foto);
                          e.target.style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <FormGrid>
                <FormGroup span={2}>
                  <Label>Nome da Pista</Label>
                  <Input value={solicitacao.nome || ''} readOnly />
                </FormGroup>

                <FormGroup span={2}>
                  <Label>Descrição</Label>
                  <TextArea value={solicitacao.descricao || ''} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Categoria</Label>
                  <Input value={solicitacao.categoria || ''} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Tipo</Label>
                  <Input value={solicitacao.publica === false ? 'Privada' : 'Pública'} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>CEP</Label>
                  <Input value={solicitacao.cep || ''} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Rua</Label>
                  <Input value={solicitacao.rua || ''} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Bairro</Label>
                  <Input value={solicitacao.bairro || ''} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Número</Label>
                  <Input value={solicitacao.numero || ''} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Data da Solicitação</Label>
                  <Input value={new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')} readOnly />
                </FormGroup>
              </FormGrid>

              <ButtonGroup>
                <CancelButton onClick={() => onReject(solicitacao)}>
                  ✗ Reprovar
                </CancelButton>
                <SaveButton onClick={() => onApprove(solicitacao)}>
                  ✓ Aprovar
                </SaveButton>
              </ButtonGroup>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
      
      <AnimatePresence>
        {imagemAmpliada && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1004,
              cursor: 'pointer'
            }}
            onClick={() => setImagemAmpliada(null)}
          >
            <motion.img 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              src={imagemAmpliada}
              alt="Imagem ampliada"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              onClick={() => setImagemAmpliada(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#333'
              }}
            >
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default SolicitacaoPistDetalsModal;