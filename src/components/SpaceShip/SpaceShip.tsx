import { useFrame, useThree } from "@react-three/fiber";
import { controls, updatePlaneAxis } from "./controls";
import {
  BufferGeometry,
  Euler,
  Matrix4,
  MathUtils,
  NormalBufferAttributes,
  Quaternion,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { addBullet } from "../../state/slices/Bullets";
import { shipCollisionGroups } from "../physics/collisionGroups";

const x = new Vector3(1, 0, 0);
const y = new Vector3(0, 1, 0);
const z = new Vector3(0, 0, 1);
export const planePosition = new Vector3(0, 3, 7);

const delayedRotMatrix = new Matrix4();
const delayedQuaternion = new Quaternion();
const shipQuaternion = new Quaternion();
const BULLET_SPAWN_OFFSET = 1.5;

type SpaceShipProps = {
  aimMode: boolean;
  onAimModeChange: (aimMode: boolean) => void;
};

function SpaceShip({ aimMode, onAimModeChange }: SpaceShipProps) {
  const shipBodyRef = useRef<RapierRigidBody>(null);
  const shipQuaternionRef = useRef(new Quaternion());
  const aimModeRef = useRef(aimMode);
  const mouseNdcRef = useRef(new Vector2(0, 0));
  const raycasterRef = useRef(new Raycaster());
  const dispatch = useDispatch();
  const { camera } = useThree();

  const { nodes, materials } = useGLTF("assets/models/Challenger.gltf");

  useEffect(() => {
    aimModeRef.current = aimMode;
  }, [aimMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      controls[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      controls[e.key.toLowerCase()] = false;
    };

    const updateMouseNdc = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseNdcRef.current.set(x, y);
    };

    const fireBullet = () => {
      const direction = new Vector3();
      if (aimModeRef.current) {
        raycasterRef.current.setFromCamera(mouseNdcRef.current, camera);
        direction.copy(raycasterRef.current.ray.direction).normalize();
      } else {
        direction
          .set(0, 0, -1)
          .applyQuaternion(shipQuaternionRef.current)
          .normalize();
      }

      const position = new Vector3().copy(planePosition);
      const rotation = new Euler().setFromQuaternion(
        new Quaternion().setFromUnitVectors(
          new Vector3(0, 0, -1),
          direction
        )
      );
      position.add(direction.clone().multiplyScalar(BULLET_SPAWN_OFFSET));

      const positionArray: [number, number, number] = [
        position.x,
        position.y,
        position.z,
      ];
      const directionArray: [number, number, number] = [
        direction.x,
        direction.y,
        direction.z,
      ];
      const rotationArray: [number, number, number] = [
        rotation.x,
        rotation.y,
        rotation.z,
      ];

      dispatch(
        addBullet({
          id: MathUtils.generateUUID(),
          position: positionArray,
          direction: directionArray,
          rotation: rotationArray,
        })
      );
    };

    const handleMouseDown = (e: MouseEvent) => {
      updateMouseNdc(e);
      if (e.button === 0) {
        fireBullet();
        return;
      }

      if (e.button === 2) {
        aimModeRef.current = true;
        onAimModeChange(true);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        aimModeRef.current = false;
        onAimModeChange(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMouseNdc(e);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [dispatch, onAimModeChange]);

  useFrame(({ camera }) => {
    updatePlaneAxis(x, y, z, planePosition, camera);
    const rotMatrix = new Matrix4().makeBasis(x, y, z);

    shipQuaternion.setFromRotationMatrix(rotMatrix);
    shipQuaternionRef.current.copy(shipQuaternion);

    shipBodyRef.current?.setNextKinematicTranslation(planePosition);
    shipBodyRef.current?.setNextKinematicRotation(shipQuaternion);

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
    <RigidBody
      ref={shipBodyRef}
      type="kinematicPosition"
      colliders="cuboid"
      collisionGroups={shipCollisionGroups}
      userData={{ type: "ship" }}
    >
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
    </RigidBody>
  );
}

useGLTF.preload("assets/models/Challenger.gltf");

export default SpaceShip;
