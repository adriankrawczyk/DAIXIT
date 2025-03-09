import { Center, Text, Text3D } from '@react-three/drei'
import React from 'react'

const InfoText = ({text, position, fontSize, color, strokeWidth, strokeColor}) => {
  return (
    <Text font="/DAIXIT/fonts/BrewedCoffee.otf" 
    position={position}
    fontSize={fontSize} 
    letterSpacing={0.04} 
    color={color} 
    strokeWidth={strokeWidth}
    strokeColor={strokeColor}
    >
      {text}
    </Text>
  )
}

export default InfoText