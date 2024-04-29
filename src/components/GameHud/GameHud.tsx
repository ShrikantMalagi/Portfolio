import { Hud, PerspectiveCamera } from "@react-three/drei";

function GameHud() {
  return (
    <Hud>
      <PerspectiveCamera makeDefault position={[0, 10, 10]} />
      <mesh>
        
      </mesh>
    </Hud>
  );
}

export default GameHud;
