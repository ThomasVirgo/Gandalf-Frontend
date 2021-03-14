import React from 'react';
import Card from '../Card';

const Player4Cards = ({cards}) => {
    let elements = (cards.map((card,index)=><Card value = {card.value} suit = {card.suit} hidden = {card.hidden} key={index}/>))
    return (
        <div>
            {elements}
        </div>
    )
}

export default Player4Cards;