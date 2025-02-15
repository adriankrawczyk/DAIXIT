/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 kitchen_table.glb 
Author: tahax (https://sketchfab.com/tahax)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/kitchen-table-2bbfa4c7c546480fa1f7855aabaa10ad
Title: Kitchen table
*/

import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/kitchen_table.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes["stoleshnica_02_-_Default_0"].geometry}
        material={materials["02_-_Default"]}
        position={[0.25, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.35, 0.35, 0.35]}
      />
    </group>
  );
}

useGLTF.preload("/kitchen_table.glb");
