import React from 'react';

//pass in as props the value e.g. jack or ace etc...
const Diamond = () => {
    return (
        <div className = 'diamond-card'>
           <div>A</div>
           <div style = {{color:'red'}}>{'\u2666'}</div>
           <div>Gandalf!</div>
        </div>
    )
}

export default Diamond;