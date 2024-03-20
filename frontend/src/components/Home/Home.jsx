import React, { useEffect } from 'react';
import Card from '../Card/Card';
import { api } from '../../utils/MainApi';

function Home({
  setCards,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
}) {

  useEffect(() => {
    api.getCards()
      .then((cardsData) => {
        setCards(cardsData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке карточек:', error);
      });
  }, []);

  return (

    <section className="home">
      <section className="elements">
        {cards.slice().reverse().map((card) => (
          <Card key={card._id} card={card} handleClick={onCardClick} handleLikeClick={onCardLike} handleDeleteClick={onCardDelete} />
        ))}
      </section>
    </section>

  );
}

export default Home;
