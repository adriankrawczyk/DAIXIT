import { useFrame } from '@react-three/fiber'
import {Vector3} from "three"
import inBounds from '../../util/maths/inBounds';

const Y_OFFSET = 3;
const MIN_Y = 2.5;
const MAX_Y = 3.5;
const MIN_X = -1;
const MAX_X = 1;


// x obraca z jakiegos powodu :///
const CameraControls = () => {
  useFrame( ({camera, mouse}) => {
    // camera.lookAt( new Vector3(0,
    //     inBounds(mouse.y + Y_OFFSET, MIN_Y, MAX_Y), 
    //     inBounds((mouse.x, MIN_X, MAX_X)
    //   )))
    // camera.lookAt(new Vector3(-1, 
    //  2.1, -0.01) )
    console.log(camera);
  })

  return null;
}

export default CameraControls