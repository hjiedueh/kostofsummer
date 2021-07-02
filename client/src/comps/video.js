import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'
import VidW from '../img/vid.webm'
import VidM from '../img/vid.mp4'
import VidO from '../img/vid.ogg'

export const Video = () => {
    return (
        <div className='port-wrapper text-center'>
            <div className='jumbo row'>
                <Jumbotron className='jumbo-wrapper'>
                    <video width="100%" controls autoPlay muted loop>
                        <source src={VidW} type="video/webm"/>
                        <source src={VidM} type="video/mp4"/>
                        <source src={VidO} type="video/ogg"/>
                    </video>
                </Jumbotron>
            </div>
        </div>
        
    )
    
}