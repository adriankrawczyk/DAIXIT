import React, { useRef } from 'react'
import CloudFragment from './CloudFragment'

const NUMBER_OF_CLOUDS = 6

const Clouds = () => {
  const cloudsLayout = useRef(
      Array.from({ length: NUMBER_OF_CLOUDS }, (_, i) => ({
        startingPosition: [ Math.random() * 30 - 15, (Math.random() * 6) - 3, (Math.random() * 20) - 5],
        scale: Math.random() * 0.5 + 0.1,
        cloudSpeed: Math.random() * 0.4 + 0.05,
        spread: 15,
        sign: i % 2 === 0 ? 1 : -1,
      }))
    );
  
  return (
    <>
     <CloudFragment 
        startingPosition={[-2,-0.2,2]} 
        scale={1} 
        key={0}
        cloudSpeed={0.1} 
        spread={4}
        sign = {1}
        />
    {cloudsLayout.current.map((item,key) => (
        <CloudFragment 
        key={key+1}
        startingPosition={item.startingPosition} 
        scale={item.scale} 
        cloudSpeed={item.cloudSpeed} 
        spread={item.spread}
        sign = {item.sign}
        />
    ))}
    {/* <CloudFragment startingPosition={[-5,4,0]} scale={Math.random() * 0.5} cloudSpeed={0.1} spread={10}/> */}
    </>
  )
}

export default Clouds