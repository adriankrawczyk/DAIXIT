import { useFrame, useLoader } from '@react-three/fiber'
import React from 'react'
import { useRef } from 'react';
import * as THREE from "three"

const CENTER_POSITION = [0,-0.5,0]

const Planets = ({texture, positionRadius, speed, fi}) => {
  const material = useLoader(THREE.TextureLoader, texture);
  const ref = useRef();
  const position = CENTER_POSITION;
  position[1] = Math.random() * 4;

  useFrame( (state) => {
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.1;

    ref.current.position.x = CENTER_POSITION[0] + Math.sin(state.clock.getElapsedTime() * speed + fi) * positionRadius;  
    ref.current.position.z = CENTER_POSITION[2] + Math.cos(state.clock.getElapsedTime() * speed + fi) * positionRadius;  
  })


  return (
    <mesh position={position} ref={ref}>
    <sphereGeometry args={[0.2]}/>
    <meshStandardMaterial attach="material" map={material}/>
    </mesh>
  )
}

export default Planets