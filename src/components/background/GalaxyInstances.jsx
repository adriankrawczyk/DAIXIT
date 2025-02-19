import React from 'react'
import GalaxyShape from './GalaxyShape'

const GalaxyInstances = () => {
  return (
    <>
    <GalaxyShape position={[6,4,-1]} rotation={[0,Math.PI/2,0]} opacity={0.5} color={"#eb9256"} scale={0.8}/>
    <GalaxyShape position={[6,3,-1]} rotation={[0,Math.PI/2,0]} opacity={0.5} color={"#7303cf"} scale={1}/>


    <GalaxyShape position={[-6,1,3]} rotation={[0,Math.PI/2,0]} opacity={0.5} color={"#da70c8"} scale={1}/>
    <GalaxyShape position={[-6,0,3]} rotation={[0,Math.PI/2,0]} opacity={0.5} color={"#2f318f"} scale={1}/>
    </>
  )
}

export default GalaxyInstances