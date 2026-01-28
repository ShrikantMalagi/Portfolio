import { AsteroidModel } from "./AteroidModel";
import { Vector3 } from "three";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { asteroidCollisionGroups } from "../physics/collisionGroups";

function Asteroid({
  position,
  id,
  destroyed = false,
  onDisintegrateComplete,
}: {
  position: Vector3;
  id: string;
  destroyed?: boolean;
  onDisintegrateComplete?: (asteroidId: string) => void;
}) {
  const bodyRef = useRef<RapierRigidBody>(null);

  useEffect(() => {
    if (destroyed) {
      bodyRef.current?.setEnabled(false);
    }
  }, [destroyed]);

  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      colliders="hull"
      position={position}
      gravityScale={0}
      collisionGroups={asteroidCollisionGroups}
      userData={{ type: "asteroid", id }}
    >
      <AsteroidModel
        destroyed={destroyed}
        onDisintegrateComplete={() => onDisintegrateComplete?.(id)}
      />
    </RigidBody>
  );
}

export default Asteroid;
