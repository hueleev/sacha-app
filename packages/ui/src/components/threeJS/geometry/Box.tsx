import React, { useRef } from "react";
import Main from "../Main";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

function RotatingBox() {
  const refMesh = useRef<Mesh>(null);

  useFrame((state, delta) => {
    console.log(state);
    if (refMesh.current) {
      refMesh.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={refMesh} rotation-y={(45 * Math.PI) / 180}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Box() {
  return (
    <Main>
      <Canvas>
        <directionalLight position={[1, 1, 1]} />
        <RotatingBox />
      </Canvas>
    </Main>
  );
}

export default Box;
