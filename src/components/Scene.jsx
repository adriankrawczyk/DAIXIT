import React from 'react'
import AllLights from './lights/AllLights'
import CameraControls from './camera/CameraControls'
import Table from './objects/Table'

const Scene = () => {
  return (
    <>
    <AllLights/>
    <CameraControls/>
    <mesh>
        <boxGeometry args={[3,3,3]}/>
        <meshStandardMaterial color={"orange"}/>
        {/* <Table/> */}
    </mesh>

    </>

  )
}

export default Scene