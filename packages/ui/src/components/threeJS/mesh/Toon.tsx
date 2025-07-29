import { Canvas } from "@react-three/fiber";
import Main from "../Main";

import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

import threeTone from "../../../assets/threeJS/gradientMaps/threeTone.jpg";
import fourTone from "../../../assets/threeJS/gradientMaps/fourTone.jpg";
import fiveTone from "../../../assets/threeJS/gradientMaps/fiveTone.jpg";

/**
 * 텍스처를 반환합니다.
 * @param number 텍스처 번호
 * @returns 텍스처
 */
function getTexture(number: number) {
  let texture;

  if (number === 3) {
    texture = useTexture(threeTone);
  } else if (number === 4) {
    texture = useTexture(fourTone);
  } else {
    texture = useTexture(fiveTone);
  }

  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

function ToonMesh() {
  return (
    <>
      <mesh position={[-2, 0, 1]}>
        <torusKnotGeometry args={[0.5, 0.15, 256, 128]} />
        <meshToonMaterial gradientMap={getTexture(3)} color="cyan" />
      </mesh>
      <mesh position={[0, 0, 1]}>
        <torusKnotGeometry args={[0.5, 0.15, 256, 128]} />
        <meshToonMaterial gradientMap={getTexture(4)} color="cyan" />
      </mesh>
      <mesh position={[2, 0, 1]}>
        <torusKnotGeometry args={[0.5, 0.15, 256, 128]} />
        <meshToonMaterial gradientMap={getTexture(5)} color="cyan" />
      </mesh>
    </>
  );
}

function Toon() {
  return (
    <Main>
      <Canvas>
        <OrbitControls />
        <directionalLight position={[0, 1, 0]} intensity={0.8} />
        <ToonMesh />
      </Canvas>
    </Main>
  );
}

export default Toon;
