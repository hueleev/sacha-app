import React from "react";
import Main from "../Main";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface MyBoxProps {
  position?: [number, number, number];
  children?: React.ReactNode;
}

function MyBox(props: MyBoxProps) {
  const geom = new THREE.BoxGeometry();
  return <mesh {...props} geometry={geom} />;
}

function ThreeBox() {
  return (
    <Main>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 1, 3]} intensity={0.5} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="#1abc9c" />
        </mesh>

        <Box position={[1.2, 0, 0]}>
          <meshStandardMaterial color="#8e44ad" />
        </Box>

        <MyBox position={[-1.2, 0, 0]}>
          <meshStandardMaterial color="#e74c3c" />
        </MyBox>
      </Canvas>
    </Main>
  );
}

export default ThreeBox;
