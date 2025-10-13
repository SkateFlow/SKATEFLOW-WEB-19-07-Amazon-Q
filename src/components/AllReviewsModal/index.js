import React from 'react';
import styled from 'styled-components';
import { FaStar, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AllReviewsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10004;
`;

const AllReviewsContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
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

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewCard = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewUser = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
`;

const ReviewStars = styled.div`
  display: flex;
  gap: 2px;
`;

const ReviewComment = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
`;

const AllReviewsModalComponent = ({ isOpen, onClose, avaliacoes }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index}
        size={14} 
        color={index < rating ? '#fbbf24' : '#d1d5db'} 
      />
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <AllReviewsModal 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <AllReviewsContent 
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
            <h3 style={{ color: '#1a237e', marginBottom: '20px' }}>Todas as Avaliações</h3>
            
            <ReviewsList>
              {avaliacoes.map((review) => (
                <ReviewCard key={review.id}>
                  <ReviewHeader>
                    <ReviewUser>
                      <FaUser size={12} color="#64748b" />
                      {review.usuario}
                    </ReviewUser>
                    <ReviewStars>
                      {renderStars(review.rating)}
                    </ReviewStars>
                  </ReviewHeader>
                  <ReviewComment>{review.comentario}</ReviewComment>
                </ReviewCard>
              ))}
            </ReviewsList>
          </AllReviewsContent>
        </AllReviewsModal>
      )}
    </AnimatePresence>
  );
};

export default AllReviewsModalComponent;