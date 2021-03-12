import React, {useState} from 'react';
import '../../CSS/Cards.css';
//pass in as props the value e.g. jack or ace etc...
const Heart = () => {

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
            <div style = {cardStyle}>
               <div className='card-top value-red'>
                    <span>A</span><span>{'\u2665'}</span>
                </div>
                <div className='card-suit'>
                    <h1 className = 'h1-suit value-red'>{'\u2665'}</h1>
                </div>
                <div className='card-bottom value-red'>
                    <span>{'\u2665'}</span><span>A</span>
                </div> 
            </div>
            
        </div>
    )
}

export default Heart;