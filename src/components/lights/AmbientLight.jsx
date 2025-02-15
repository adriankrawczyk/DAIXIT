import React from 'react'

const AmbientLight = ( {intensity, color} ) => {
  return (
    <ambientLight intensity={intensity} color={color} />
  )
}

export default AmbientLight