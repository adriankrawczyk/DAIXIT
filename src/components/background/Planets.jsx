import { useFrame, useLoader } from '@react-three/fiber'
import React from 'react'
import { useRef } from 'react';
import * as THREE from "three"

const CENTER_POSITION = [0,-0.5,0]

const Planets = ({texture, positionRadius, speed}) => {
  const material = useLoader(THREE.TextureLoader, texture);
  const ref = useRef();
  const sign = ( Math.random() * 3 ) % 2 === 0 ? 1 : -1;
  const position = [ (Math.random() - 2) * positionRadius, Math.random() * 2 + 1, 0]
  position[2] = Math.sqrt(positionRadius*positionRadius - position[0]*position[0]) * sign;

  useFrame( (state) => {
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.1;

    ref.current.position.x = CENTER_POSITION[0] + Math.sin(state.clock.getElapsedTime() * speed) * positionRadius;  
    ref.current.position.z = CENTER_POSITION[2] + Math.cos(state.clock.getElapsedTime() * speed) * positionRadius;  
  })


  return (
    <mesh position={position} ref={ref}>
    <sphereGeometry args={[0.1]}/>
    <meshStandardMaterial attach="material" map={material}/>
    </mesh>
  )
}

export default Planets