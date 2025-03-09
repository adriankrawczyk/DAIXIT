import { Center, Text3D } from '@react-three/drei'
import React from 'react'

const InfoText = ({text}) => {
  return (
    <Center>
    <Text3D font="/fonts/KidsMagazine.ttf" position={[0, 1, 0]} size={1}>
      {text}
      <meshStandardMaterial color="orange" />
    </Text3D>
  </Center>
  )
}

export default InfoText