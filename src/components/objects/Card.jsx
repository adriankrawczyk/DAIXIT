import { useLoader } from '@react-three/fiber'
import { TextureLoader } from "three";
import React from 'react'

const Card = () => {
  const cardImage = useLoader(TextureLoader, "/card.png");
 
  return (
    <mesh position={[0,1,3]} rotation={[-Math.PI/8,0,0]}>
    <boxGeometry args={[0.64,0.896,0.02]}/>
    <meshBasicMaterial attachArray="material" color="white" />
    <meshBasicMaterial attachArray="material" color="white" />
    <meshBasicMaterial attachArray="material" color="white" />
    <meshBasicMaterial attachArray="material" color="white" />
    <meshStandardMaterial attachArray="material" map={cardImage} />
    <meshStandardMaterial attachArray="material" map={cardImage} />
    </mesh>
  )
}

export default Card