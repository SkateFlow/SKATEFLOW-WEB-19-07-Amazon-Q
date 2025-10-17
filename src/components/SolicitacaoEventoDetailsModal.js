import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiMapPin, FiUser } from 'react-icons/fi';
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
} from './EditPistaModal/EditPistaModalElements';

const SolicitacaoEventoDetailsModal = ({ isOpen, onClose, solicitacao, onApprove, onReject }) => {
  const [fotosProcessadas, setFotosProcessadas] = useState([]);
  const [imagemAmpliada, setImagemAmpliada] = useState(null);

  useEffect(() => {
    if (solicitacao && solicitacao.fotos) {
      const fotos = solicitacao.fotos.filter(foto => foto && foto.trim() !== '');
      setFotosProcessadas(fotos);
    }
  }, [solicitacao]);

  if (!solicitacao) return null;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

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
              <ModalTitle>Detalhes da Solicitação de Evento</ModalTitle>
              <CloseButton onClick={onClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              {fotosProcessadas.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <Label>Fotos do Evento</Label>
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
                      />
                    ))}
                  </div>
                </div>
              )}

              <FormGrid>
                <FormGroup span={2}>
                  <Label>Nome do Evento</Label>
                  <Input value={solicitacao.nome || ''} readOnly />
                </FormGroup>

                <FormGroup span={2}>
                  <Label>Descrição</Label>
                  <TextArea value={solicitacao.info || ''} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Data de Início</Label>
                  <Input value={formatDate(solicitacao.dataInicio)} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Data de Fim</Label>
                  <Input value={formatDate(solicitacao.dataFim)} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Local (ID)</Label>
                  <Input value={solicitacao.lugar_id?.id || 'Não informado'} readOnly />
                </FormGroup>

                <FormGroup>
                  <Label>Solicitado por</Label>
                  <Input value={solicitacao.criadoPor || 'Não informado'} readOnly />
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
    </AnimatePresence>
  );
};

export default SolicitacaoEventoDetailsModal;