import React, { useRef } from 'react'
import Star from './Star';
import Planets from './Planets';
import GalaxyInstances from './GalaxyInstances';

const STAR_NUMBER = 50;

const MAX_X_SPEED = 0.2;
const MAX_Y_SPEED = 0.3;

const MIN_VALUE = -20;
const SPREAD = 40;


const Galaxy = () => {
    /// STARS
    const starsArray = useRef(
      Array.from({ length: STAR_NUMBER }, (_, i) => ({
        startingPosition: [ (Math.random() * SPREAD) + MIN_VALUE, (Math.random() * SPREAD) + MIN_VALUE, -10],
        xSign: i%4===1 ? 1 : -1,
        ySign: i%4===3 ? 1 : -1,
        xSpeed: Math.random() * MAX_X_SPEED,
        ySpeed: Math.random() * MAX_Y_SPEED,
      }))
    );
    /// PLANETS AND MOON
    const planetTextures = useRef(["/earth.jpg", "/jupiter.jpg", "/moon.jpg", "/alien_planet.jpg"]); 

  return (
    <>
    {
        starsArray.current.map( (item, key) => (
            <Star key={key} position={item.startingPosition} xSign={item.xSign} ySign={item.ySign} xSpeed={item.xSpeed} ySpeed={item.ySpeed}/> 
        ))
    }
    {
        planetTextures.current.map( (item, key) => (
            <Planets texture={item} positionRadius={(key+1)*1.4 + 2} speed={Math.random() * 0.4 + 0.1}/>
        ))
    }
    <GalaxyInstances/>
    </>
  )
}

export default Galaxy