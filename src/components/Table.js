import React from 'react';
import Spade from './Cards/Spades';
import Club from './Cards/Clubs';
import Diamond from './Cards/Diamonds';
import Heart from './Cards/Hearts';

const Table = () => {
    return (
        <div>
            <Spade/>
            <Club/>
            <Diamond/>
            <Heart/>
        </div>
    )
}

export default Table;