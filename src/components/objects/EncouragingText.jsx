import React from 'react'
import InfoText from '../lobby/util/InfoText'
import { Float } from '@react-three/drei'

const EncouragingText = () => {
  return (
    <Float rotationIntensity={0.2} floatIntensity={0.2} floatingRange={[-0.05, 0.05]}>
    <InfoText 
    text={"Write your special word and choose your"} 
    position={[-0.5,3,3]} 
    fontSize={0.27}
    color={"#F0B964"}
    strokeWidth={0.012}
    strokeColor={"#a32c64"}
    />

    <InfoText 
    text={"card"} 
    position={[3,3,3]} 
    fontSize={0.27}
    color={"#a32c64"}
    strokeWidth={0.012}
    strokeColor={"#c49755"}
    />
    </Float>
  )
}

export default EncouragingText