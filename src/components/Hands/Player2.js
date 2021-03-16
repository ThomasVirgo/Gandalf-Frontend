import React from 'react';
import Card from '../Card';

const Player2Cards = ({cards, hiddenCards}) => {
    let hiddenArr = hiddenCards.player2;
    let elements = (cards.map((card,index)=><Card value = {card.value} suit = {card.suit} hidden = {hiddenArr[index]} key={index}/>))
    return (
        <div>
            {elements}
        </div>
    )
}

export default Player2Cards;