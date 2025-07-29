import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Main from "../Main";

import { OrbitControls } from "@react-three/drei";
import { Mesh } from "three";
import { useControls } from "leva";

import * as THREE from "three";

function GlassMesh() {
  const mesh1Ref = useRef<Mesh>(null);
  const mesh2Ref = useRef<Mesh>(null);

  const config = useControls({
    roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    metalness: { value: 0, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 0, min: 0, max: 1, step: 0.01 },
    clearcoatRoughness: { value: 0, min: 0, max: 1, step: 0.01 },
    transmission: { value: 1, min: 0, max: 1, step: 0.01 },
    thickness: { value: 0.1, min: 0, max: 1, step: 0.01 },
    ior: { value: 1.5, min: 1, max: 2, step: 0.01 },
  });
  useEffect(() => {
    if (mesh1Ref.current && mesh2Ref.current) {
      mesh2Ref.current.material = mesh1Ref.current.material;
    }
  }, [config]);

  return (
    <>
      <mesh ref={mesh1Ref} position={[0.8, 0, 2.5]}>
        <torusKnotGeometry args={[0.5, 0.15, 256, 128]} />
        <meshPhysicalMaterial
          visible={true}
          transparent={true}
          opacity={1}
          color={0xffffff}
          emissive={0x000000}
          side={THREE.DoubleSide}
          {...config}
        />
      </mesh>

      <mesh ref={mesh2Ref} position={[-0.8, 0, 2.5]}>
        <torusGeometry args={[0.5, 0.2, 16, 64]} />
      </mesh>
    </>
  );
}

function Glass() {
  return (
    <Main>
      <Canvas camera={{ near: 1, far: 10 }}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 1, 0]} />
        <directionalLight position={[1, 2, 8]} intensity={0.7} />
        <GlassMesh />
      </Canvas>
    </Main>
  );
}

export default Glass;
