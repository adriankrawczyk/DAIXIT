import React, { useEffect, useRef, useState } from 'react';
import Card from './Card';
import gsap from 'gsap';

const CardsComponent = ({ numberOfCards }) => {

  const [currentHovered, setCurrentHovered] = useState(-1);
  const [currentClicked, setCurrentClicked] = useState(-1);
  const [disableHover, setDisableHover] = useState(false);
  const previouslyClickedRef = useRef(-1);

  /// REFERENCES ///
  const cardsLayout = useRef(
    Array.from({ length: numberOfCards }, (_, i) => ({
      position: [(i - 2) / 2 + 0.2, 0.75, 3 + i * 0.01],
      rotation: [-Math.PI / 8, 0, Math.PI / 16],
    }))
  );
  const cardsRef = useRef([]);

  /// ADDING TO TABLE ANIMATIONS ///
    const addCardOnTable = (index) => {
     if (cardsRef.current[index]?.current) 
    {
        setDisableHover(true);
      gsap.to(cardsRef.current[index].current.position, { x:0.2, y:0.5, z:0.3, 
        duration: 0.2,
        ease: "power2.in"
      });
      gsap.to(cardsRef.current[index].current.rotation, { x:-Math.PI/2, y:0, z:-Math.PI/2, 
        duration: 0.2,
        ease: "power2.in"
      });
      gsap.delayedCall(0.2, () => setDisableHover(false));
    }
    }
  
    const backToHand = (index) => {
       if (cardsRef.current[index]?.current) 
       {
        setDisableHover(true);
       gsap.to(cardsRef.current[index].current.position, { x:(index - 2) / 2 + 0.2, y:0.75, z:3 + index * 0.01, 
        duration: 0.2,
        ease: "power2.out"
       });
       gsap.to(cardsRef.current[index].current.rotation, { x:-Math.PI / 8, y:0, z:Math.PI / 16, 
        duration: 0.2,
        ease: "power2.out"
      });
      gsap.delayedCall(0.2, () => setDisableHover(false))
      }
    }


  useEffect( () => {
    if (previouslyClickedRef.current !== -1)
    {
        backToHand(previouslyClickedRef.current);
    }

    // jakas inna karta zostala kliknieta
    if ( currentClicked !== -1 )
    {
        addCardOnTable(currentClicked)
        backToHand(previouslyClickedRef.current)
        previouslyClickedRef.current = currentClicked
    }
    else 
    {
        // ta sama karta jest kliknieta co byla na stole
        backToHand(currentClicked)
        previouslyClickedRef.current = -1
    }
  }, [currentClicked])

  return (
    <>
      {cardsLayout.current.map((item, key) => (
        <Card
          index={key}
          key={key}
          cardsRef = {cardsRef}
          currentHovered={currentHovered}
          disableHover = {disableHover}
          setCurrentHovered={setCurrentHovered}
          currentClicked={currentClicked}
          setCurrentClicked = {setCurrentClicked}
          position={item.position}
          rotation={item.rotation}
        />
      ))}
    </>
  );
};

export default CardsComponent;
