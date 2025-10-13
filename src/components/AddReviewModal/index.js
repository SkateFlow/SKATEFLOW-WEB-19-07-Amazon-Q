import React from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AddReviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10005;
`;

const AddReviewContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  padding: 24px;
  position: relative;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 4px;
  margin: 16px 0;
`;

const Star = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #1a237e 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const AddReviewModalComponent = ({ isOpen, onClose, onSubmit, rating, setRating, comment, setComment }) => {
  const renderStars = (currentRating, onStarClick) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} onClick={() => onStarClick(index + 1)}>
        <FaStar 
          size={20} 
          color={index < currentRating ? '#fbbf24' : '#d1d5db'} 
        />
      </Star>
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <AddReviewModal 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <AddReviewContent 
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
            <h3 style={{ color: '#1a237e', marginBottom: '16px' }}>Avaliar Pista</h3>
            
            <div>
              <label style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}>Sua avaliação:</label>
              <StarRating>
                {renderStars(rating, setRating)}
              </StarRating>
            </div>
            
            <div>
              <label style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}>Comentário:</label>
              <ReviewTextarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Compartilhe sua experiência nesta pista..."
              />
            </div>
            
            <SubmitButton onClick={onSubmit}>
              Enviar Avaliação
            </SubmitButton>
          </AddReviewContent>
        </AddReviewModal>
      )}
    </AnimatePresence>
  );
};

export default AddReviewModalComponent;