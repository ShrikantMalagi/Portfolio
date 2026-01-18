import { useFrame } from "@react-three/fiber";
import { DoubleSide, Euler, Scene, TextureLoader, Vector3, WebGLRenderTarget} from "three";


const scene = new Scene();
scene.background = new TextureLoader().load(
  // thanks to https://www.creativeshrimp.com/midjourney-text-to-images.html
  process.env.PUBLIC_URL + "assets/textures/low-angle-shot-mesmerizing-starry-sky.jpg",
);

const target = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  stencilBuffer: false,
});

window.addEventListener("resize", () => {
  target.setSize(window.innerWidth, window.innerHeight);
});

function Portal({position=new Vector3(-1, 2, 0) ,rotation=new Euler(0, 0, Math.PI / 2)}:{position?:Vector3,rotation?:Euler}){

    useFrame((state) => {
        state.gl.setRenderTarget(target);
        state.gl.render(scene, state.camera);
        state.gl.setRenderTarget(null);
      });
    

    return(
        <mesh  position={position} rotation={rotation} scale={[1.5, 1, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={target.texture} side={DoubleSide} />
      </mesh>
    )
}

export default Portal;