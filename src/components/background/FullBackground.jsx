import React from 'react'
import BackgroundColor from './BackgroundColor'
import Star from './Star'
import Galaxy from './Galaxy'

const FullBackground = () => {
  return (
    <>
    {/* <Star position={[0,0,-10]}/> */}
    <Galaxy/>
    <BackgroundColor/> 
    </>
  )
}

export default FullBackground