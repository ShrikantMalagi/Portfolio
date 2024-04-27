import { Canvas } from "@react-three/fiber";
import { Portal, SpaceShip, SphereEnv } from "../../components";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

function Space() {
  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <SphereEnv />
        <Environment
          background={false}
          files={"assets/textures/HDR_blue_nebulae-1.hdr"}
        />
        <PerspectiveCamera makeDefault position={[0, 10, 10]} />
        <SpaceShip/>
        <Portal/>
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
            blendFunction={BlendFunction.NORMAL} // blend mode
            hue={-0.15} // hue in radians
            saturation={0.1} // saturation in radians
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

export default Space;
