import { RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { MeshBasicMaterial } from "three";

const BULLET_SPEED = 20;

const bulletMaterial = new MeshBasicMaterial({
  color: "hotpink",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

 const Bullet = ({ angle, position, onHit }) => {
  const rigidbody = useRef();

  useEffect(() => {
    const velocity = {
      x: Math.sin(angle) * BULLET_SPEED,
      y: 0,
      z: Math.cos(angle) * BULLET_SPEED,
    };

    rigidbody.current.setLinvel(velocity, true);
  }, [angle]);

  return (
    <group position={[position.x, position.y, position.z]} rotation-y={angle}>
      {/* <group
        position-x={WEAPON_OFFSET.x}
        position-y={WEAPON_OFFSET.y}
        position-z={WEAPON_OFFSET.z}
      > */}
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
          <mesh position-z={0.25} material={bulletMaterial} castShadow>
            <boxGeometry args={[0.05, 0.05, 0.5]} />
          </mesh>
        </RigidBody>
      {/* </group> */}
    </group>
  );
};

export default Bullet;