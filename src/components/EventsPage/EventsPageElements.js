const EventsContainer = styled.div`
     min-height: 120vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgb(0,41,79);
    background: linear-gradient(90deg, rgba(0,41,79,1) 0%, rgba(0,20,38,1) 35%, rgba(0,20,38,1) 100%);
    padding: 50px 0;
`;

const EventCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
`;

const EventCard = styled.div`
  flex: 1 1 calc(33.333% - 40px); /* 3 cards por linha */
  padding: 20px;
  border: 1px solid #ccc;
  background-color: white;
  color: black;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 40px); /* 2 cards por linha em telas menores */
  }

  @media (max-width: 480px) {
    flex: 1 1 100%; /* 1 card por linha em telas muito pequenas */
  }

  img {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
  }
`;