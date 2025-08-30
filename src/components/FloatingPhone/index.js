import React from "react";
import { motion } from "framer-motion";
import { FiBatteryCharging, FiWifi } from "react-icons/fi";
import styled from "styled-components";
import logoInvertSvg from '../../assets/images/logoofinver.svg';

const Container = styled.div`
  display: grid;
  place-content: center;
  padding: 48px;
`;

const PhoneContainer = styled.div`
  transform-style: preserve-3d;
  transform: rotateY(-30deg) rotateX(15deg);
  border-radius: 24px;
  background: #2f56a0ff;
`;

const PhoneBody = styled(motion.div)`
  position: relative;
  height: 384px;
  width: 224px;
  border-radius: 24px;
  border: 2px solid white;
  border-bottom: 4px solid white;
  border-right: 4px solid white;
  border-left: 2px solid #e5e5e5;
  border-top: 2px solid #e5e5e5;
  background: #171717;
  padding: 4px;
  padding-left: 3px;
  padding-top: 3px;
`;

const HeaderBar = styled.div`
  position: absolute;
  left: 50%;
  top: 10px;
  z-index: 10;
  height: 8px;
  width: 64px;
  transform: translateX(-50%);
  border-radius: 6px;
  background: #171717;
`;

const StatusIcons = styled.div`
  position: absolute;
  right: 12px;
  top: 8px;
  z-index: 10;
  display: flex;
  gap: 8px;
  color: #525252;
`;

const Screen = styled.div`
  position: relative;
  z-index: 0;
  display: grid;
  place-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
  background: white;
`;

const Logo = styled.img`
  width: 80px;
  height: auto;
  margin-bottom: 20px;
`;

const GetStartedButton = styled.button`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 10;
  border-radius: 8px;
  border: 1px solid #000000ff;
  background: white;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #000000ff;
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #000000ff;
    color: white;
  }
`;

const BackgroundCircle = styled.div`
  position: absolute;
  bottom: -288px;
  left: 50%;
  height: 384px;
  width: 384px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: #294881ff;
`;

const FloatingPhone = () => {
  return (
    <Container>
      <PhoneContainer>
        <PhoneBody
          initial={{
            transform: "translateZ(8px) translateY(-2px)",
          }}
          animate={{
            transform: "translateZ(32px) translateY(-8px)",
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <HeaderBar />
          <StatusIcons>
            <FiWifi />
            <FiBatteryCharging />
          </StatusIcons>
          
          <Screen>
            <Logo src={logoInvertSvg} alt="SkateFlow" />
            
            <GetStartedButton>
              Baixar App
            </GetStartedButton>

            <BackgroundCircle />
          </Screen>
        </PhoneBody>
      </PhoneContainer>
    </Container>
  );
};

export default FloatingPhone;