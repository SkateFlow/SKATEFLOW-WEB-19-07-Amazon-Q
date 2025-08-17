import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FlipCardContainer = styled.div`
  position: relative;
  cursor: pointer;
  perspective: 1000px;
  transition: all 0.3s ease;
  width: 280px;
  height: 562px;
  transform: rotate(45deg);
`;

const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 1s;
  transform-style: preserve-3d;
  transform: ${props => props.isFlipped ? 'rotateY(360deg)' : 'rotateY(0deg)'};
`;

const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardBack = styled(CardSide)`
  transform: rotateY(180deg);
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.8));
`;

const FlipCard = ({ imageSrc, backImageSrc, className }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load image:', imageSrc);
      setImageLoaded(false);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  return (
    <FlipCardContainer
      className={className}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <FlipCardInner isFlipped={isFlipped}>
        <CardSide>
          <ImageContainer>
            {imageLoaded && (
              <CardImage
                src={imageSrc}
                alt="Front image"
              />
            )}
          </ImageContainer>
        </CardSide>

        <CardBack>
          <ImageContainer>
            {imageLoaded && (
              <CardImage
                src={backImageSrc || imageSrc}
                alt="Back image"
              />
            )}
          </ImageContainer>
        </CardBack>
      </FlipCardInner>
    </FlipCardContainer>
  );
};

export default FlipCard;