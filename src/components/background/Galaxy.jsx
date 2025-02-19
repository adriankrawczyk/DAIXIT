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
    const backStarsArray = useRef(
      Array.from({ length: STAR_NUMBER }, (_, i) => ({
        startingPosition: [ (Math.random() * SPREAD) + MIN_VALUE, (Math.random() * SPREAD) + MIN_VALUE, -10],
        xSign: i%4===1 ? 1 : -1,
        ySign: i%4===3 ? 1 : -1,
        zSign: 0,
        xSpeed: Math.random() * MAX_X_SPEED,
        ySpeed: Math.random() * MAX_Y_SPEED,
        zSpeed: 0,
      }))
    );


    const frontStarsArray = useRef(
      Array.from({ length: STAR_NUMBER }, (_, i) => ({
        startingPosition: [ (Math.random() * SPREAD) + MIN_VALUE, (Math.random() * SPREAD) + MIN_VALUE, 8],
        xSign: i%4===1 ? 1 : -1,
        ySign: i%4===3 ? 1 : -1,
        zSign: 0,
        xSpeed: Math.random() * MAX_X_SPEED,
        ySpeed: Math.random() * MAX_Y_SPEED,
        zSpeed: 0,
      }))
    );

    const rightStarsArray = useRef(
      Array.from({ length: STAR_NUMBER }, (_, i) => ({
        startingPosition: [ 6, (Math.random() * SPREAD) + MIN_VALUE, (Math.random() * SPREAD) + MIN_VALUE],
        xSign: 0,
        ySign: i%4===3 ? 1 : -1,
        zSign: i%4===1 ? 1 : -1,
        xSpeed: 0,
        ySpeed: Math.random() * MAX_Y_SPEED,
        zSpeed: Math.random() * MAX_X_SPEED,
      }))
    );

    const leftStarsArray = useRef(
      Array.from({ length: STAR_NUMBER }, (_, i) => ({
        startingPosition: [ -6, (Math.random() * SPREAD) + MIN_VALUE, (Math.random() * SPREAD) + MIN_VALUE],
        xSign: 0,
        ySign: i%4===3 ? 1 : -1,
        zSign: i%4===1 ? 1 : -1,
        xSpeed: 0,
        ySpeed: Math.random() * MAX_Y_SPEED,
        zSpeed: Math.random() * MAX_X_SPEED,
      }))
    );



    /// PLANETS AND MOON
    const planetTextures = useRef(["/earth.jpg", "/jupiter.jpg", "/moon.jpg", "/alien_planet.jpg"]); 

  return (
    <>
    { backStarsArray.current.map( (item, key) => (
            <Star key={key} position={item.startingPosition} xSign={item.xSign} ySign={item.ySign} zSign={0} xSpeed={item.xSpeed} ySpeed={item.ySpeed} zSpeed={item.zSpeed}/> 
        )) }

    { frontStarsArray.current.map( (item, key) => (
            <Star key={key} position={item.startingPosition} xSign={item.xSign} ySign={item.ySign} zSign={0} xSpeed={item.xSpeed} ySpeed={item.ySpeed} zSpeed={item.zSpeed}/> 
        )) }

    { rightStarsArray.current.map( (item, key) => (
            <Star key={key} position={item.startingPosition} xSign={item.xSign} ySign={item.ySign} zSign={0} xSpeed={item.xSpeed} ySpeed={item.ySpeed} zSpeed={item.zSpeed}/> 
        )) }

    { leftStarsArray.current.map( (item, key) => (
            <Star key={key} position={item.startingPosition} xSign={item.xSign} ySign={item.ySign} zSign={0} xSpeed={item.xSpeed} ySpeed={item.ySpeed} zSpeed={item.zSpeed}/> 
        )) }


    {
        planetTextures.current.map( (item, key) => (
            <Planets texture={item} positionRadius={(key+1)*1.5 + 3} speed={Math.random() * 0.02 + 0.01} fi={Math.random() * Math.PI}/>
        ))
    }
    <GalaxyInstances/>
    </>
  )
}

export default Galaxy