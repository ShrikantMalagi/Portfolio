import { useFrame } from "@react-three/fiber";
import { RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { MeshBasicMaterial, Vector3 } from "three";

const BULLET_SPEED = 2;

const bulletMaterial = new MeshBasicMaterial({
  color: "hotpink",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

const Bullet = ({ angle, position, onHit }) => {
  const rigidbody = useRef();
  const groupRef = useRef();
  useFrame(() => {
    console.log("bullet", rigidbody.current.position);
  });

  useFrame(() => {
    console.log(groupRef.current);
    const velocity = new Vector3(
      groupRef.current.position.x + angle.x * BULLET_SPEED+ BULLET_SPEED,
      groupRef.current.position.y + angle.y * BULLET_SPEED+ BULLET_SPEED,
      groupRef.current.position.z + angle.z * BULLET_SPEED+ + BULLET_SPEED
    );

    rigidbody.current.setLinvel(velocity, true);
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={angle}
    >
      <group position-x={0.5} position-y={0.5} position-z={0.5}>
        <RigidBody
          ref={rigidbody}
          gravityScale={0}
          onIntersectionEnter={(e) => {
            if (e.other.rigidBody.userData?.type !== "bullet") {
              rigidbody.current.setEnabled(false);
              onHit(vec3(rigidbody.current.translation()));
            }
          }}
          sensor
          userData={{
            type: "bullet",
            damage: 10,
          }}
        >
          <mesh material={bulletMaterial} castShadow>
            <boxGeometry args={[0.05, 0.05, 0.5]} />
          </mesh>
        </RigidBody>
      </group>
    </group>
  );
};

export default Bullet;
