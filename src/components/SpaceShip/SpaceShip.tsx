import { useFrame } from "@react-three/fiber";
import { controls, updatePlaneAxis } from "./controls";
import {
  BufferGeometry,
  Group,
  Matrix4,
  NormalBufferAttributes,
  Quaternion,
  Vector3,
} from "three";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

const x = new Vector3(1, 0, 0);
const y = new Vector3(0, 1, 0);
const z = new Vector3(0, 0, 1);
export const planePosition = new Vector3(0, 3, 7);

const delayedRotMatrix = new Matrix4();
const delayedQuaternion = new Quaternion();

function SpaceShip() {
  const groupRef = useRef<Group>(null);

  const { nodes, materials } = useGLTF("assets/models/Challenger.gltf");

  useFrame(({ camera }) => {
    window.addEventListener("keydown", (e) => {
      controls[e.key.toLowerCase()] = true;
    });
    window.addEventListener("keyup", (e) => {
      controls[e.key.toLowerCase()] = false;
    });

    window.addEventListener("onClick", (e) => {
      
    });

    updatePlaneAxis(x, y, z, planePosition, camera);
    const rotMatrix = new Matrix4().makeBasis(x, y, z);

    const matrix = new Matrix4()
      .multiply(
        new Matrix4().makeTranslation(
          planePosition.x,
          planePosition.y,
          planePosition.z
        )
      )
      .multiply(rotMatrix);
    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false;
      groupRef.current.matrix.copy(matrix);
      groupRef.current.matrixWorldNeedsUpdate = true;
    }

    var quaternionA = new Quaternion().copy(delayedQuaternion);

    var quaternionB = new Quaternion();
    quaternionB.setFromRotationMatrix(rotMatrix);

    var interpolationFactor = 0.175;
    var interpolatedQuaternion = new Quaternion().copy(quaternionA);
    interpolatedQuaternion.slerp(quaternionB, interpolationFactor);
    delayedQuaternion.copy(interpolatedQuaternion);

    delayedRotMatrix.identity();
    delayedRotMatrix.makeRotationFromQuaternion(delayedQuaternion);

    const cameraMatrix = new Matrix4()
      .multiply(
        new Matrix4().makeTranslation(
          planePosition.x,
          planePosition.y,
          planePosition.z
        )
      )
      .multiply(delayedRotMatrix)
      .multiply(new Matrix4().makeRotationX(-0.2))
      .multiply(new Matrix4().makeTranslation(0, 0.015, 0.3));

    camera.matrixAutoUpdate = false;
    camera.matrix.copy(cameraMatrix);
    camera.matrixWorldNeedsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <group dispose={null} scale={0.01} rotation-y={Math.PI}>
        <mesh
          material={materials.Texture}
          geometry={
            "geometry" in nodes.Challenger
              ? (nodes.Challenger
                  ?.geometry as BufferGeometry<NormalBufferAttributes>)
              : undefined
          }
        />
      </group>
    </group>
  );
}

useGLTF.preload("assets/models/Challenger.gltf");

export default SpaceShip;
