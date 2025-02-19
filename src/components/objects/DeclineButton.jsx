import React, { forwardRef } from "react";

const DeclineButton = forwardRef((props, ref) => {
  return (
    <mesh ref={ref} position={[2.3, 1, 2]} rotation={[-Math.PI / 13, 0, 0]} scale={0}>
      <boxGeometry args={[1, 0.5, 0.1]} />
      <meshStandardMaterial color={"red"} />
    </mesh>
  );
});

export default DeclineButton;