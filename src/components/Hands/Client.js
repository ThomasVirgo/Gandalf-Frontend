import React from 'react';
import Card from '../Card';


const ClientCards = ({cards, hiddenCards, setHiddenCards}) => {
    let hiddenArr = hiddenCards.clientCards;
    let elements = (cards.map((card,index)=><Card value = {card.value} suit = {card.suit} hidden = {hiddenArr[index]} key={index} hiddenCards = {hiddenCards} setHiddenCards = {setHiddenCards} index= {index} whoseCards = {'clientCards'}/>))
    return (
        <div style={{display:'flex'}}>
            {elements}
        </div>
    )
}

export default ClientCards;