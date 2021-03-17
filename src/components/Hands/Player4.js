import React from 'react';
import Card from '../Card';

const Player4Cards = ({cards, hiddenCards, setHiddenCards}) => {
    let hiddenArr = hiddenCards.player4;
    let elements = (cards.map((card,index)=><Card value = {card.value} suit = {card.suit} hidden = {hiddenArr[index]} key={index} hiddenCards = {hiddenCards} setHiddenCards = {setHiddenCards} index= {index} whoseCards = {'player4'}/>))
    return (
        <div>
            {elements}
        </div>
    )
}

export default Player4Cards;