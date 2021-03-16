import React from 'react';
import Card from '../Card';

const Player4Cards = ({cards, hiddenCards}) => {
    let hiddenArr = hiddenCards.player4;
    let elements = (cards.map((card,index)=><Card value = {card.value} suit = {card.suit} hidden = {hiddenArr[index]} key={index}/>))
    return (
        <div>
            {elements}
        </div>
    )
}

export default Player4Cards;