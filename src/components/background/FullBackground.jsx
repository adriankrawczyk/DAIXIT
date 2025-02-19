import React from 'react'
import BackgroundColor from './BackgroundColor'
import Clouds from './Clouds'
import Star from './Star'
import Galaxy from './Galaxy'

const FullBackground = () => {
  return (
    <>
    {/* <Clouds/> */}
    {/* <Star position={[0,0,-10]}/> */}
    <Galaxy/>
    <BackgroundColor/> 
    </>
  )
}

export default FullBackground