import React from 'react'
import Card from './Card'

const CardsComponent = () => {
  const cardXPositions = [-2,-1,0,1,2]

  return (
    <>
    {
    cardXPositions.map( (item,key) => 
    <Card xPosition={item}/> 
    )
    }</>
  )
}

export default CardsComponent