import { useGLTF } from "@react-three/drei";
import { AsteroidModel } from "./AteroidModel";
import { Vector3 } from "three";

function Asteroid({position}:{position:Vector3}) {
  return (
    <AsteroidModel position={position}/>
  );
}

export default Asteroid;
