import React from 'react'
import AmbientLight from './AmbientLight';
import DirectionalLight from './DirectionalLight';

const DIRECTIONAL_LIGHT_POSITION = [0, 2, 2.4];
const DIRECTIONAL_LIGHT_INTENSITY = 1
const DIRECTIONAL_LIGHT_COLOR = 0xffffff

const AMBIENT_LIGHT_INTENSITY = 0.3
const AMBIENT_LIGHT_COLOR = 0xa3a3a3


const AllLights = () => {
  return (
    <>
    <AmbientLight 
    intensity={AMBIENT_LIGHT_INTENSITY}
    color={AMBIENT_LIGHT_COLOR}
    />

    <DirectionalLight 
    intensity={DIRECTIONAL_LIGHT_INTENSITY}
    color={DIRECTIONAL_LIGHT_COLOR}
    position={DIRECTIONAL_LIGHT_POSITION}
    />
    
    </>
  )
}

export default AllLights