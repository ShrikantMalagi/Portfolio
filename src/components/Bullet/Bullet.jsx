import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { MeshBasicMaterial, Vector3 } from "three";
import { bulletCollisionGroups } from "../physics/collisionGroups";

const BULLET_SPEED = 2;
const MAX_BULLET_DISTANCE = 60;
const MAX_BULLET_LIFETIME = 4;

const bulletMaterial = new MeshBasicMaterial({
  color: "hotpink",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

const Bullet = ({ id, direction, position, rotation, onHit, onExpire }) => {
  const rigidbody = useRef();
  const directionVector = useMemo(
    () => new Vector3().fromArray(direction).normalize(),
    [direction]
  );
  const velocity = useMemo(() => new Vector3(), []);
  const startPosition = useMemo(() => new Vector3().fromArray(position), [position]);
  const currentPosition = useMemo(() => new Vector3(), []);
  const lifetime = useRef(0);
  const expired = useRef(false);

  const expire = () => {
    if (expired.current) {
      return;
    }
    expired.current = true;
    rigidbody.current?.setEnabled(false);
    onExpire?.(id);
  };

  useFrame((_, delta) => {
    if (!rigidbody.current || expired.current) {
      return;
    }
    velocity.copy(directionVector).multiplyScalar(BULLET_SPEED);
    rigidbody.current.setLinvel(velocity, true);

    lifetime.current += delta;
    if (lifetime.current >= MAX_BULLET_LIFETIME) {
      expire();
      return;
    }

    const translation = rigidbody.current.translation();
    currentPosition.set(translation.x, translation.y, translation.z);
    if (currentPosition.distanceTo(startPosition) >= MAX_BULLET_DISTANCE) {
      expire();
    }
  });

  return (
    <RigidBody
      ref={rigidbody}
      gravityScale={0}
      position={position}
      rotation={rotation}
      collisionGroups={bulletCollisionGroups}
      colliders="cuboid"
      onIntersectionEnter={(e) => {
        const otherType = e.other.rigidBody?.userData?.type;
        if (otherType === "asteroid") {
          onHit?.(e.other.rigidBody?.userData?.id);
          expire();
        }
      }}
      sensor
      userData={{
        type: "bullet",
        damage: 10,
      }}
    >
      <mesh material={bulletMaterial} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.9]} />
      </mesh>
    </RigidBody>
  );
};

export default Bullet;
