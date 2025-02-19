import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'

const X_ALTITUDE = 20;
const Y_ALTITUDE = 5;

const Star = ({position, xSign, ySign, xSpeed, ySpeed}) => {
    const starRef = useRef();

    useFrame((state)=>{
        // state
        starRef.current.position.x = position[0] + Math.cos(state.clock.getElapsedTime() * xSpeed) * X_ALTITUDE * xSign
        starRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * ySpeed) * Y_ALTITUDE * ySign
        starRef.current.position.z = position[2] + Math.cos(state.clock.getElapsedTime() * 0.5)
    })
   
  return (
    <mesh position={position} ref={starRef}>
    <sphereGeometry args={[0.03, 32, 32]} />
    <meshStandardMaterial emissive="yellow" emissiveIntensity={10} />
  </mesh>
  )
}

export default Star