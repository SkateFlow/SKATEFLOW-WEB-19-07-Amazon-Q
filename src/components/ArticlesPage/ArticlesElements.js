import styled from 'styled-components';
import { Link } from 'react-router-dom';
 
export const ArticlesContainer = styled.div`
    min-height: 120vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgb(0,41,79);
    background: linear-gradient(90deg, rgba(0,41,79,1) 0%, rgba(0,20,38,1) 35%, rgba(0,20,38,1) 100%);
    padding: 50px 0;
`;
 
export const Icon = styled(Link)`
    font-size: 2rem;
    color: #fff;
    position: absolute;
    top: 18px;
    left: 16px;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
 
    &:hover {
        color: #202020;
    }
`;
 
 
export const ArticlesTitle = styled.h1`
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 20px;
 
    @media screen and (max-width: 480px) {
        font-size: 2rem;
    }
`;
 
export const ArticlesWrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    grid-gap: 16px;
    padding: 0 20px;
 
    @media screen and (max-width: 1000px) {
        grid-template-columns: 1fr 1fr;
    }
 
    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;
 
export const ArticleCard = styled.div`
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px;
    height: 340px;
    padding: 30px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;
 
    &:hover {
        transform: scale(1.05);
        cursor: pointer;
    }
`;
 
export const ArticleIcon = styled.img`
    height: 160px;
    width: 160px;
    margin-bottom: 10px;
`;
 
export const ArticleHeading = styled.h2`
    font-size: 1rem;
    color: #010606;
    margin-bottom: 10px;
    text-align: center;
`;
 
export const ArticleDescription = styled.p`
    font-size: 1rem;
    text-align: center;
    color: #010606;
`;
 
export const ArticleContent = styled.div`
    font-size: 1rem;
    color: #333;
    line-height: 1.6;
    text-align: left;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    max-width: 800px;
    width: 100%;
`;
 
export const BackButton = styled(Link)`
    text-align: center;
    margin-top: 24px;
    color: #fff;
    font-size: 14px;
`;
 