import React from 'react'

const WinscreenUI = ({players, numberOfPlayers}) => {
    // if a user gets a certain amount of points he wins the game
  return (
    <mesh position={[1,1,1]}>
      <boxGeometry args={[1,1,1]}/>
      <meshStandardMaterial/>
    </mesh>
  )
}

export default WinscreenUI