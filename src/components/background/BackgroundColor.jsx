import { useFrame } from '@react-three/fiber';
import { Depth, LayerMaterial } from 'lamina'
import React, { useRef } from 'react'
import * as THREE from "three"

const BG_SPEED = 0.2

const BackgroundColor = () => {
  const backgroundRef = useRef();

  useFrame((_state, delta) => {
    backgroundRef.current.rotation.x += delta * BG_SPEED
    backgroundRef.current.rotation.y += delta * BG_SPEED
    backgroundRef.current.rotation.z += delta * BG_SPEED
  })

  return (
    <mesh scale={100} ref={backgroundRef}>
        <sphereGeometry args={[1,64,64]} />
        <LayerMaterial side={THREE.BackSide}>
            <Depth
            colorA={"#ff9bd8"}
            colorB={"#7745ff"}
            alpha={1}
            mode="normal"
            near={130}
            far={200}
            origin={[100,100,-100]}
            />
        </LayerMaterial>
    </mesh>
  )
}

export default BackgroundColor