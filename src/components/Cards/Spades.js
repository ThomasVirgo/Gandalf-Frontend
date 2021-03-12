import React from 'react';

//pass in as props the value e.g. jack or ace etc...
const Spade = () => {
    return (
        <div className = 'spade-card'>
           <div>7</div>
           <div>{'\u2660'}</div>
           <div>Gandalf!</div>
        </div>
    )
}

export default Spade;
