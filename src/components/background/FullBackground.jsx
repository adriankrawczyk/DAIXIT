import React from "react";
import BackgroundColor from "./BackgroundColor";
import Star from "./Star";
import Galaxy from "./Galaxy";

const FullBackground = ( {
  colorA = "#190042",
  colorB = "#624475"
}) => {
  return (
    <>
      {/* <Star position={[0,0,-10]}/> */}
      <Galaxy />
      <BackgroundColor colorA = {colorA} colorB = {colorB}/>
    </>
  );
};

export default FullBackground;
