import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaGlobe, FaLock, FaChevronLeft, FaChevronRight, FaSkating, FaStar, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import AllReviewsModalComponent from '../AllReviewsModal';
import AddReviewModalComponent from '../AddReviewModal';
import ThankYouModalComponent from '../ThankYouModal';
import { avaliacaoService } from '../../services/avaliacaoService';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10003;
  animation: ${props => props.isClosing ? 'fadeOut' : 'fadeIn'} 200ms ease-in-out forwards;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const PopupContent = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 0;
  max-width: 650px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: ${props => props.isClosing ? 'slideOut' : 'slideIn'} 300ms ease-in-out forwards;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
  }
`;

const InstructionText = styled.div`
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #9ca3af;
  white-space: nowrap;
`;

const PopupBody = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
`;

const CarouselTrack = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 700ms ease-out;
  transform: translateX(-${props => props.currentIndex * 100}%);
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.2) 0%, transparent 50%, transparent 100%);
  opacity: 0;
  transition: opacity 300ms ease;
  
  ${ImageContainer}:hover & {
    opacity: 1;
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.5);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }
`;

const PrevButton = styled(CarouselButton)`
  left: 16px;
  
  &:hover svg {
    transform: translateX(-2px);
  }
`;

const NextButton = styled(CarouselButton)`
  right: 16px;
  
  &:hover svg {
    transform: translateX(2px);
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  padding: 8px 12px;
`;

const Dot = styled.button`
  border: none;
  cursor: pointer;
  transition: all 300ms ease;
  border-radius: 20px;
  background: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'};
  width: ${props => props.active ? '24px' : '12px'};
  height: 12px;
  box-shadow: ${props => props.active ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'};
    transform: scale(1.1);
  }
`;

const PistaHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const PistaTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #1a237e;
  margin: 0;
  line-height: 1.2;
  flex: 1;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.publica ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.publica ? '#166534' : '#92400e'};
  white-space: nowrap;
`;

const PistaDescription = styled.p`
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1f2937;
`;

const InfoIcon = styled.div`
  color: #1a237e;
  display: flex;
  align-items: center;
  min-width: 20px;
`;

const InfoText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
`;

const CoordinatesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const CoordinateItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const CoordinateLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

const CoordinateValue = styled.span`
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  font-family: monospace;
`;

const PistaCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = images.filter(img => img && img.trim() !== '');
  const displayImages = validImages.length > 0 ? validImages : ['https://via.placeholder.com/650x300/667eea/ffffff?text=🛹+Pista+de+Skate'];

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToIndex = (index) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer>
      <CarouselTrack currentIndex={currentIndex}>
        {displayImages.map((image, index) => (
          <ImageContainer key={index}>
            <CarouselImage
              src={image}
              alt={`Pista image ${index + 1}`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/480x220/667eea/ffffff?text=🛹+Erro+ao+Carregar';
              }}
            />
            <ImageOverlay />
          </ImageContainer>
        ))}
      </CarouselTrack>
      
      {displayImages.length > 1 && (
        <>
          <PrevButton onClick={goToPrevious}>
            <FaChevronLeft size={18} />
          </PrevButton>
          
          <NextButton onClick={goToNext}>
            <FaChevronRight size={18} />
          </NextButton>
          
          <DotsContainer>
            {displayImages.map((_, index) => (
              <Dot
                key={index}
                active={index === currentIndex}
                onClick={() => goToIndex(index)}
              />
            ))}
          </DotsContainer>
        </>
      )}
    </CarouselContainer>
  );
};



const ReviewsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReviewsTitle = styled.h3`
  color: #1a237e;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const AddReviewButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  color: #6b7280;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
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

const ViewMoreButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.3s ease;

  &:hover {
    color: #5a67d8;
  }
`;

const PistaPopup = ({ pista, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    if (pista?.id) {
      loadAvaliacoes();
    }
    
    // Carregar usuário atual
    const savedUser = localStorage.getItem('skateflow_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, [pista]);
  
  const loadAvaliacoes = async () => {
    try {
      const avaliacoesData = await avaliacaoService.buscarPorLugar(pista.id);
      const media = await avaliacaoService.buscarMedia(pista.id);
      setAvaliacoes(avaliacoesData);
      setMediaAvaliacoes(media);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmitReview = async () => {
    try {
      // Verificar se usuário está logado
      const savedUser = localStorage.getItem('skateflow_user');
      if (!savedUser) {
        alert('Você precisa estar logado para avaliar uma pista');
        return;
      }
      
      const userData = JSON.parse(savedUser);
      if (!userData || !userData.id) {
        alert('Você precisa estar logado para avaliar uma pista');
        return;
      }
      
      await avaliacaoService.criar({
        lugarId: pista.id,
        usuarioId: userData.id,
        rating: newRating,
        comentario: newComment
      });
      
      setShowAddReview(false);
      setShowThankYou(true);
      setNewRating(0);
      setNewComment('');
      
      // Recarregar avaliações
      await loadAvaliacoes();
    } catch (error) {
      alert(error);
    }
  };
  
  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setNewComment(review.comentario);
    setShowAddReview(true);
  };
  
  const handleUpdateReview = async () => {
    try {
      const savedUser = localStorage.getItem('skateflow_user');
      if (!savedUser) {
        alert('Você precisa estar logado');
        return;
      }
      
      const userData = JSON.parse(savedUser);
      
      await avaliacaoService.atualizar(editingReview.id, {
        usuarioId: userData.id,
        rating: newRating,
        comentario: newComment
      });
      
      setShowAddReview(false);
      setEditingReview(null);
      setNewRating(0);
      setNewComment('');
      
      await loadAvaliacoes();
    } catch (error) {
      alert(error);
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Tem certeza que deseja excluir sua avaliação?')) {
      return;
    }
    
    try {
      const savedUser = localStorage.getItem('skateflow_user');
      if (!savedUser) {
        alert('Você precisa estar logado');
        return;
      }
      
      const userData = JSON.parse(savedUser);
      
      await avaliacaoService.deletar(reviewId, userData.id);
      await loadAvaliacoes();
    } catch (error) {
      alert(error);
    }
  };

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
    <>
      <PopupOverlay onClick={handleClose} isClosing={isClosing}>
        <PopupContent onClick={(e) => e.stopPropagation()} isClosing={isClosing}>
          <InstructionText>clique fora para sair</InstructionText>
          
          <PopupBody>
            <PistaCarousel images={pista.fotos || pista.images || []} />
            
            <PistaHeader>
              <PistaTitle>{pista.nome || pista.name}</PistaTitle>
              <StatusBadge publica={pista.tipo === 'Pública' || pista.publica}>
                {(pista.tipo === 'Pública' || pista.publica) ? <FaGlobe size={12} /> : <FaLock size={12} />}
                {pista.tipo || (pista.publica ? 'Pública' : 'Privada')}
              </StatusBadge>
            </PistaHeader>
            
            <PistaDescription>{pista.descricao || pista.description}</PistaDescription>
            
            <InfoSection>
              <InfoRow>
                <InfoIcon><FaMapMarkerAlt size={18} /></InfoIcon>
                <InfoText>
                  {pista.rua && pista.bairro 
                    ? `${pista.rua}${pista.numero && pista.numero !== '0' ? `, ${pista.numero}` : ''} - ${pista.bairro}${pista.cep ? ` (${pista.cep})` : ''}`
                    : pista.endereco || pista.location || 'Endereço não informado'
                  }
                </InfoText>
              </InfoRow>
              <InfoRow>
                <InfoIcon><span style={{ fontSize: '16px' }}>🛹</span></InfoIcon>
                <InfoText>Categoria: {pista.categoria?.nome || 'Não informada'}</InfoText>
              </InfoRow>
              <InfoRow>
                <InfoIcon><FaUser size={16} /></InfoIcon>
                <InfoText>Cadastrado por: {(pista.usuario?.nome || 'Usuário não informado').replace(/0$/, '')}</InfoText>
              </InfoRow>
              {(pista.tipo === 'Privada' || (!pista.publica && pista.tipo !== 'Pública')) && pista.valor && parseFloat(pista.valor) > 0 && (
                <InfoRow>
                  <InfoIcon><span style={{ fontSize: '16px' }}>💵</span></InfoIcon>
                  <InfoText>Valor: R$ {parseFloat(pista.valor).toFixed(2).replace('.', ',')}</InfoText>
                </InfoRow>
              )}
            </InfoSection>

            <ReviewsSection>
              <ReviewsHeader>
                <ReviewsTitle>Avaliações</ReviewsTitle>
                <AddReviewButton onClick={() => setShowAddReview(true)}>
                  Avaliar
                </AddReviewButton>
              </ReviewsHeader>
              
              <ReviewsList>
                {avaliacoes.length > 0 ? (
                  <>
                    {avaliacoes.slice(0, 3).map((review) => (
                      <ReviewCard key={review.id}>
                        <ReviewHeader>
                          <ReviewUser>
                            <FaUser size={12} color="#64748b" />
                            {review.usuario?.nome || 'Usuário'}
                          </ReviewUser>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ReviewStars>
                              {renderStars(review.rating)}
                            </ReviewStars>
                            {currentUser && currentUser.id === review.usuario?.id && (
                              <div style={{ display: 'flex', gap: '6px', marginLeft: '8px' }}>
                                <button
                                  onClick={() => handleEditReview(review)}
                                  style={{
                                    background: '#e0f2fe',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '4px 6px',
                                    color: '#0277bd',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => e.target.style.background = '#b3e5fc'}
                                  onMouseLeave={(e) => e.target.style.background = '#e0f2fe'}
                                >
                                  <FaEdit size={10} />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  style={{
                                    background: '#fee2e2',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '4px 6px',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                                  onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                                >
                                  <FaTrash size={10} />
                                </button>
                              </div>
                            )}
                          </div>
                        </ReviewHeader>
                        <ReviewComment>{review.comentario}</ReviewComment>
                      </ReviewCard>
                    ))}
                    {avaliacoes.length > 3 && (
                      <ViewMoreButton onClick={() => setShowAllReviews(true)}>
                        Ver mais avaliações
                      </ViewMoreButton>
                    )}
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '32px 16px',
                    color: '#64748b',
                    fontSize: '14px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐</div>
                    Esta pista ainda não tem nenhuma avaliação.
                    <br />
                    Seja o primeiro a avaliar!
                  </div>
                )}
              </ReviewsList>
            </ReviewsSection>
          </PopupBody>
        </PopupContent>
      </PopupOverlay>
      
      <AllReviewsModalComponent 
        isOpen={showAllReviews}
        onClose={() => setShowAllReviews(false)}
        avaliacoes={avaliacoes}
      />
      
      <AddReviewModalComponent 
        isOpen={showAddReview}
        onClose={() => {
          setShowAddReview(false);
          setEditingReview(null);
          setNewRating(0);
          setNewComment('');
        }}
        onSubmit={editingReview ? handleUpdateReview : handleSubmitReview}
        rating={newRating}
        setRating={setNewRating}
        comment={newComment}
        setComment={setNewComment}
        isEditing={!!editingReview}
      />
      
      <ThankYouModalComponent 
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
      />
    </>
  );
};

export default PistaPopup;