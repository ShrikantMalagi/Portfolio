import { Canvas } from "@react-three/fiber";
import {
  Asteroid,
  Bullet,
  Portal,
  SpaceShip,
  SphereEnv,
} from "../../components";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store/types";
import { asteroids_number } from "./constants";
import { MathUtils, Vector3 } from "three";

function Space() {
  const bullets = useSelector((state: RootState) => state.bullets);
  const asteroids = Array.from({ length: asteroids_number }, (_, index) => index);
  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <SphereEnv />
        <Environment
          background={false}
          files={"assets/textures/HDR_blue_nebulae-1.hdr"}
        />
        <PerspectiveCamera makeDefault position={[0, 10, 10]} />
        <SpaceShip />
        <Portal />
        {bullets.length > 0 &&
          bullets.map((bullet) => (
            <Bullet
              angle={bullet.angle}
              position={bullet.position}
              onHit={undefined}
            />
          ))}
        {asteroids.map( asteroid => 
          <Asteroid
            position={
              new Vector3(
                MathUtils.randFloat(-15, 15),
                MathUtils.randFloat(-15, 15),
                MathUtils.randFloat(-15, 15)
              )
            }
          />
        )}
        <directionalLight
          castShadow
          color={"#FFFFF"}
          intensity={200}
          position={[10, 5, 4]}
          shadow-bias={-0.0005}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.01}
          shadow-camera-far={20}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-camera-left={-6.2}
          shadow-camera-right={6.4}
        />

        <EffectComposer>
          <HueSaturation
            blendFunction={BlendFunction.NORMAL}
            hue={-0.15}
            saturation={0.1}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

export default Space;
