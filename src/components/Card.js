import React, {useState} from 'react';
import '../CSS/Cards.css';
//pass in as props the value e.g. jack or ace etc...
const Card = ({value, suit}) => {

    let symbols = {
        'diamonds':'\u2666',
        'hearts':'\u2665',
        'clubs':'\u2663',
        'spades':'\u2660'
    }

    let suitSymbol = symbols[suit];
    let textStyle = {};
    if (suit === 'diamonds' || suit === 'hearts'){
        textStyle = {color:'red'};
    } else {
        textStyle = {color:'black'};
    }

    let cardColor, cardStyle;
    const [hidden, setHidden] = useState(false);

    if (hidden){
        cardColor = {backgroundColor:'darkRed'};
        cardStyle = {visibility:'hidden'};
    } else {
        cardColor = {backgroundColor:'white'};
        cardStyle = {};
    }

    function toggleHidden(){
        setHidden(!hidden);
    };

    return (
        <div className = 'card-container' style={cardColor} onClick={toggleHidden}>
            <div style={cardStyle}>
                <div className='card-top' style={textStyle}>
                    <span>{value}</span><span>{suitSymbol}</span>
                </div>
                <div className='card-suit'>
                    <h1 className = 'h1-suit value-black' style={textStyle}>{suitSymbol}</h1>
                </div>
                <div className='card-bottom' style={textStyle}>
                    <span>{suitSymbol}</span><span>{value}</span>
                </div> 
            </div>
            
        </div>
    )
}

export default Card;