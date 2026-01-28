import { Canvas } from "@react-three/fiber";
import {
  Asteroid,
  Bullet,
  GameHud,
  Portal,
  SpaceShip,
  SphereEnv,
} from "../../components";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store/types";
import { asteroids_number } from "./constants";
import { MathUtils, Vector3 } from "three";
import { Physics } from "@react-three/rapier";
import { removeBullet } from "../../state/slices/Bullets";

type AsteroidState = {
  id: string;
  position: Vector3;
  status: "alive" | "destroying";
};

function Space() {
  const bullets = useSelector((state: RootState) => state.bullets);
  const dispatch = useDispatch();
  const [aimMode, setAimMode] = useState(false);
  const [asteroids, setAsteroids] = useState(() =>
    Array.from({ length: asteroids_number }, (_, index): AsteroidState => ({
      id: `asteroid-${index}`,
      position: new Vector3(
        MathUtils.randFloat(-15, 15),
        MathUtils.randFloat(-15, 15),
        MathUtils.randFloat(-15, 15)
      ),
      status: "alive",
    }))
  );

  const handleBulletHit = useCallback((asteroidId?: string) => {
    if (!asteroidId) {
      return;
    }
    setAsteroids((current) =>
      current.map((asteroid) =>
        asteroid.id === asteroidId && asteroid.status === "alive"
          ? { ...asteroid, status: "destroying" }
          : asteroid
      )
    );
  }, []);

  const handleBulletExpire = useCallback(
    (bulletId?: string) => {
      if (!bulletId) {
        return;
      }
      dispatch(removeBullet(bulletId));
    },
    [dispatch]
  );

  const handleAsteroidDisintegrateComplete = useCallback((asteroidId: string) => {
    setAsteroids((current) =>
      current.filter((asteroid) => asteroid.id !== asteroidId)
    );
  }, []);
  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <SphereEnv />
        <Environment
          background={false}
          files={"assets/textures/HDR_blue_nebulae-1.hdr"}
        />
        <PerspectiveCamera makeDefault position={[0, 10, 10]} />
        <Portal />
        <Physics gravity={[0, 0, 0]}>
        <SpaceShip aimMode={aimMode} onAimModeChange={setAimMode} />
        {
          bullets.map((bullet) => 
            <Bullet
              key={bullet.id}
              id={bullet.id}
              direction={bullet.direction}
              position={bullet.position}
              rotation={bullet.rotation}
              onHit={handleBulletHit}
              onExpire={handleBulletExpire}
            />
          )
          }
        {asteroids.map((asteroid) => 
          <Asteroid
            key={asteroid.id}
            id={asteroid.id}
            position={asteroid.position}
            destroyed={asteroid.status === "destroying"}
            onDisintegrateComplete={handleAsteroidDisintegrateComplete}
          />
        )}
        </Physics>
        <GameHud aimMode={aimMode} />
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
