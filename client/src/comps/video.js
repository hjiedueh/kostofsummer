import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Vid from '../img/vid.webm'

export const Video = () => {
    return (
        <div className='port-wrapper text-center'>
            <div className='jumbo row'>
                <Jumbotron className='jumbo-wrapper'>
                    <video width="100%" controls autoPlay muted loop>
                        <source src={Vid} type="video/webm"/>
                    </video>
                </Jumbotron>
            </div>
        </div>
        
    )
    
}