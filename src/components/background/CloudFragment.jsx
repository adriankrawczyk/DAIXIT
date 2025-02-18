import { Cloud, MeshWobbleMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Depth, LayerMaterial } from 'lamina'
import React, { useRef } from 'react'
import * as THREE from "three"

const CloudFragment = ({startingPosition, scale, cloudSpeed, spread, sign }) => {
  const cloudRef = useRef();
  useFrame( (state, delta) => {
    cloudRef.current.position.x = sign*Math.sin(state.clock.getElapsedTime() * cloudSpeed) * spread
  } )

  return (
    <Cloud
      ref={cloudRef}
      position={startingPosition}
      scale={scale}
      opacity={0.5}
      speed={1}
      width={5} 
      depth={1.5}
      segments={20} 
      color={"white"}
    />
  )
}

export default CloudFragment