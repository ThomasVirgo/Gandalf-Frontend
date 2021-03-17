import React from 'react';
import Card from '../Card';

const Player3Cards = ({cards, hiddenCards, setHiddenCards}) => {
    let hiddenArr = hiddenCards.player3;
    let elements = (cards.map((card,index)=><Card value = {card.value} suit = {card.suit} hidden = {hiddenArr[index]} key={index} hiddenCards = {hiddenCards} setHiddenCards = {setHiddenCards} index= {index} whoseCards = {'player3'}/>))
    return (
        <div>
            {elements}
        </div>
    )
}

export default Player3Cards;