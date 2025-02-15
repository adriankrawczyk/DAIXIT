import './App.css'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import { OrbitControls } from '@react-three/drei'
import * as THREE from "three";
// camera={
//   {
//     fov : 45,
//     aspect: window.innerWidth/ window.innerHeight,
//     near: 0.001,
//     far: 1000,
//     position: [-5.5, -6, 0]
//   }
//  }
//  onCreated={({camera}) => camera.lookAt(0,0,0)}



const App = () => {

  return (
    <>
     <Canvas 
     
     camera={
  {
    fov : 45,
    near: 0.001,
    far: 1000,
    aspect: window.innerWidth / window.innerHeight,
    // // x = obraca ??
    // // y = z
    // // z = y
    // // position: [0
    // //   ,-4.5, 2.74],
    position: [5.5, 6, 0]
  }}

  // onCreated = { ({gl, camera}) => {
  //   gl.setSize(window.innerWidth, window.innerHeight);
  //   camera.aspect = window.innerWidth / window.innerHeight
  //   camera.updateProjectionMatrix();
  //   // camera.position.set({5.5, 6, 0});
  //   camera.lookAt(-1, 2.1, -0.01);
  // }

 
     >
      <Scene/>
      <OrbitControls/>
     </Canvas>
    </>
  )
}

export default App
