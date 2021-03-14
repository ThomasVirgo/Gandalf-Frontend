import React from 'react';
import Card from '../Card';

const Player3Cards = ({cards}) => {
    let elements = (cards.map((card,index)=><Card value = {card.value} suit = {card.suit} hidden = {card.hidden} key={index}/>))
    return (
        <div style = {{display:'flex'}}>
            {elements}
        </div>
    )
}

export default Player3Cards;