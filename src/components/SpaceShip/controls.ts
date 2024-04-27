import { Vector3 } from "three";
import { IControls } from "./types";

function easeOutQuad(x : number) {
    return 1 - (1 - x) * (1 - x);
  }

  export let controls:IControls = {};
  
  let maxVelocity = 0.04;
  let jawVelocity = 0;
  let pitchVelocity = 0;
  let planeSpeed = 0.00;
  export let turbo = 0;
  
  export function updatePlaneAxis(x:Vector3, y:Vector3, z:Vector3, planePosition:Vector3, camera:any) {
    jawVelocity *= 0.95;
    pitchVelocity *= 0.95;
  
    if (Math.abs(jawVelocity) > maxVelocity) 
      jawVelocity = Math.sign(jawVelocity) * maxVelocity;
  
    if (Math.abs(pitchVelocity) > maxVelocity) 
      pitchVelocity = Math.sign(pitchVelocity) * maxVelocity;
  
    if (controls["a"]) {
      jawVelocity += 0.0025;
    }
  
    if (controls["d"]) {
      jawVelocity -= 0.0025;
    }
  
    if (controls["w"]) {
      pitchVelocity -= 0.0025;
    }
  
    if (controls["s"]) {
      pitchVelocity += 0.0025;
    }
  
    if (controls["r"]) {
      jawVelocity = 0;
      pitchVelocity = 0;
      turbo = 0;
      x.set(1, 0, 0);
      y.set(0, 1, 0);
      z.set(0, 0, 1);
      planePosition.set(0, 3, 7);
    }
  
    x.applyAxisAngle(z, jawVelocity);
    y.applyAxisAngle(z, jawVelocity);
  
    y.applyAxisAngle(x, pitchVelocity);
    z.applyAxisAngle(x, pitchVelocity);
  
    x.normalize();
    y.normalize();
    z.normalize();
  
  
    // plane position & velocity
    if (controls.shift) {
      turbo += 0.025;
    } else {
      turbo *= 0.95;
    }
    turbo = Math.min(Math.max(turbo, 0), 1);
  
    let turboSpeed = easeOutQuad(turbo) * 0.02;
  
    camera.fov = 45 + turboSpeed * 900;
    camera.updateProjectionMatrix();
  
    planePosition.add(z.clone().multiplyScalar(-planeSpeed -turboSpeed));
  }