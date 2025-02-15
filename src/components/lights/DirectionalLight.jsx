import React from 'react'

const DirectionalLight = ( {position, intensity, color} ) => {
  return (
    <directionalLight position={position} intensity={intensity} color={color}/>
  )
}

export default DirectionalLight