import { useGLTF } from "@react-three/drei";
import { AsteroidModel } from "./AteroidModel";
import { Vector3 } from "three";

function Asteroid({position}:{position:Vector3}) {
  const model1 = useGLTF("assets/models/Asterid_explodable.glb");
  //Asteroid_Icosphere_cell001

  console.log('model 1', model1);
  return (
    <AsteroidModel position={position}/>
  );
}

export default Asteroid;
