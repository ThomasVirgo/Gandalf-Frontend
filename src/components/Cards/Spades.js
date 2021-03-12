import React, {useState} from 'react';
import '../../CSS/Cards.css';
//pass in as props the value e.g. jack or ace etc...
const Spade = ({value}) => {

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
        <div className = 'card-container' style = {cardColor} onClick={toggleHidden}>
            <div style = {cardStyle}>
                <div className='card-top'>
                    <span>{value}</span><span>{'\u2660'}</span>
                </div>
                <div className='card-suit'>
                    <h1 className = 'h1-suit value-black'>{'\u2660'}</h1>
                </div>
                <div className='card-bottom'>
                    <span>{'\u2660'}</span><span>{value}</span>
                </div>   
            </div>
        </div>
    )
}

export default Spade;
