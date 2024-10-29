import styled from 'styled-components';
 
export const ArticlesContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #000;
    padding: 50px 0;
 
    @media screen and (max-width: 768px) {
        padding: 100px 0;
    }
`;
 
export const ArticlesTitle = styled.h1`
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 64px;
 
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
 