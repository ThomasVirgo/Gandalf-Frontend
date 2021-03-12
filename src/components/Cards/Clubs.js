import React from 'react';

//pass in as props the value e.g. jack or ace etc...
const Club = () => {
    return (
        <div className = 'club-card'>
           <div>9</div>
           <div>{'\u2663'}</div>
           <div>Gandalf!</div>
        </div>
    )
}

export default Club;
