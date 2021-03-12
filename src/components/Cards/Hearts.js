import React from 'react';

//pass in as props the value e.g. jack or ace etc...
const Heart = () => {
    return (
        <div className = 'heart-card'>
           <div>J</div>
           <div style = {{color:'red'}}>{'\u2665'}</div>
           <div>Gandalf!</div>
        </div>
    )
}

export default Heart;