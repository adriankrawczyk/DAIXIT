import React, { useMemo } from "react";
import Star from "./Star";
import Planets from "./Planets";
import GalaxyInstances from "./GalaxyInstances";

const STAR_NUMBER = 50;
const MAX_X_SPEED = 0.2;
const MAX_Y_SPEED = 0.3;
const MIN_VALUE = -20;
const SPREAD = 40;

const Galaxy = () => {
  const backStarsArray = useMemo(
    () =>
      Array.from({ length: STAR_NUMBER }, (_, i) => ({
        startingPosition: [
          Math.random() * SPREAD + MIN_VALUE,
          Math.random() * SPREAD + MIN_VALUE,
          -10,
        ],
        xSign: i % 4 === 1 ? 1 : -1,
        ySign: i % 4 === 3 ? 1 : -1,
        zSign: 0,
        xSpeed: Math.random() * MAX_X_SPEED,
        ySpeed: Math.random() * MAX_Y_SPEED,
        zSpeed: 0,
      })),
    []
  );

  const frontStarsArray = useMemo(
    () =>
      Array.from({ length: STAR_NUMBER }, (_, i) => ({
        startingPosition: [
          Math.random() * SPREAD + MIN_VALUE,
          Math.random() * SPREAD + MIN_VALUE,
          8,
        ],
        xSign: i % 4 === 1 ? 1 : -1,
        ySign: i % 4 === 3 ? 1 : -1,
        zSign: 0,
        xSpeed: Math.random() * MAX_X_SPEED,
        ySpeed: Math.random() * MAX_Y_SPEED,
        zSpeed: 0,
      })),
    []
  );

  const rightStarsArray = useMemo(
    () =>
      Array.from({ length: STAR_NUMBER }, (_, i) => ({
        startingPosition: [
          6,
          Math.random() * SPREAD + MIN_VALUE,
          Math.random() * SPREAD + MIN_VALUE,
        ],
        xSign: 0,
        ySign: i % 4 === 3 ? 1 : -1,
        zSign: i % 4 === 1 ? 1 : -1,
        xSpeed: 0,
        ySpeed: Math.random() * MAX_Y_SPEED,
        zSpeed: Math.random() * MAX_X_SPEED,
      })),
    []
  );

  const leftStarsArray = useMemo(
    () =>
      Array.from({ length: STAR_NUMBER }, (_, i) => ({
        startingPosition: [
          -6,
          Math.random() * SPREAD + MIN_VALUE,
          Math.random() * SPREAD + MIN_VALUE,
        ],
        xSign: 0,
        ySign: i % 4 === 3 ? 1 : -1,
        zSign: i % 4 === 1 ? 1 : -1,
        xSpeed: 0,
        ySpeed: Math.random() * MAX_Y_SPEED,
        zSpeed: Math.random() * MAX_X_SPEED,
      })),
    []
  );

  const planetTextures = useMemo(
    () =>
      [
        "/DAIXIT/earth.jpg",
        "/DAIXIT/jupiter.jpg",
        "/DAIXIT/moon.jpg",
        "/DAIXIT/alien_planet.jpg",
      ].map((texture, index) => ({
        texture,
        speed: Math.random() * 0.02 + 0.01,
        fi: Math.random() * Math.PI,
      })),
    []
  );

  return (
    <>
      {backStarsArray.map((item, key) => (
        <Star
          key={key}
          position={item.startingPosition}
          xSign={item.xSign}
          ySign={item.ySign}
          zSign={0}
          xSpeed={item.xSpeed}
          ySpeed={item.ySpeed}
          zSpeed={item.zSpeed}
        />
      ))}

      {frontStarsArray.map((item, key) => (
        <Star
          key={key}
          position={item.startingPosition}
          xSign={item.xSign}
          ySign={item.ySign}
          zSign={0}
          xSpeed={item.xSpeed}
          ySpeed={item.ySpeed}
          zSpeed={item.zSpeed}
        />
      ))}

      {rightStarsArray.map((item, key) => (
        <Star
          key={key}
          position={item.startingPosition}
          xSign={item.xSign}
          ySign={item.ySign}
          zSign={0}
          xSpeed={item.xSpeed}
          ySpeed={item.ySpeed}
          zSpeed={item.zSpeed}
        />
      ))}

      {leftStarsArray.map((item, key) => (
        <Star
          key={key}
          position={item.startingPosition}
          xSign={item.xSign}
          ySign={item.ySign}
          zSign={0}
          xSpeed={item.xSpeed}
          ySpeed={item.ySpeed}
          zSpeed={item.zSpeed}
        />
      ))}

      {planetTextures.map((item, key) => (
        <Planets
          key={key}
          texture={item.texture}
          positionRadius={(key + 1) * 1.5 + 3}
          speed={item.speed}
          fi={item.fi}
        />
      ))}
      <GalaxyInstances />
    </>
  );
};

export default Galaxy;
