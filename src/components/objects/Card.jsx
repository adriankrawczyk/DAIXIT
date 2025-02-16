import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, Vector3 } from "three";
import React, { useRef } from 'react'
import gsap from 'gsap';


const Card = ({cardsRef, position, rotation, currentHovered, disableHover, setCurrentHovered, currentClicked, setCurrentClicked, index}) => {
  const cardImage = useLoader(TextureLoader, "/card.png");
  const currentCardRef = useRef();
  cardsRef.current[index] = currentCardRef;

  const hoverAnimation = () => {
    gsap.to(currentCardRef.current.position, { x:currentCardRef.current.position.x, y:currentCardRef.current.position.y, z: 3.03 + index*0.03, 
      duration: 0.2,
      ease: "power2.in"
     });
  }

  const unhoverAnimation = () => {
    gsap.to(currentCardRef.current.position, 
        { x:currentCardRef.current.position.x, y:currentCardRef.current.position.y, z: 3 + index*0.01, 
        duration: 0.2,
        ease: "power2.out"
    });
  }

  return (
    <mesh 
    position={position} 
    ref = {currentCardRef}
    rotation={rotation} 

    onPointerEnter={ (e) => {
      e.stopPropagation(); 
        if ( !disableHover && currentClicked !== index && currentHovered !== index) {
          hoverAnimation();
          setCurrentHovered(index);
        }
    }} 
    onPointerLeave={(e) => {
      e.stopPropagation();
      if ( !disableHover && currentClicked !== index && currentHovered === index) {
        unhoverAnimation();
        setCurrentHovered(-1);
      }
    }}

    onClick = { (e) => {
      e.stopPropagation();
      if (currentClicked === index)
      {
        setCurrentClicked(-1);
      }
      else {
        setCurrentClicked(index);
      }
    }}
    >
    <boxGeometry args={[0.64,0.896,0.02]}/>
    <meshBasicMaterial attachArray="material" color="white" />
    <meshBasicMaterial attachArray="material" color="white" />
    <meshBasicMaterial attachArray="material" color="white" />
    <meshBasicMaterial attachArray="material" color="white" />
    <meshStandardMaterial attachArray="material" map={cardImage} />
    <meshStandardMaterial attachArray="material" map={cardImage} />
    </mesh>
  )
}

export default Card