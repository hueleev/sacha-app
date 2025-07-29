import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Main from "../Main";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { Mesh } from "three";

function SegmentsMesh() {
  const refMesh = useRef<Mesh>(null);
  const refWireMesh = useRef<Mesh>(null);

  const { xSize, ySize, zSize, xSegments, ySegments, zSegments } = useControls({
    xSize: { value: 1, min: 0, max: 10, step: 0.1 },
    ySize: { value: 1, min: 0, max: 10, step: 0.1 },
    zSize: { value: 1, min: 0, max: 10, step: 0.1 },
    xSegments: { value: 1, min: 0, max: 10, step: 1 },
    ySegments: { value: 1, min: 0, max: 10, step: 1 },
    zSegments: { value: 1, min: 0, max: 10, step: 1 },
  });

  useEffect(() => {
    if (refWireMesh.current && refMesh.current) {
      refWireMesh.current.geometry = refMesh.current.geometry;
    }
  }, [xSize, ySize, zSize, xSegments, ySegments, zSegments]);

  return (
    <>
      <mesh ref={refMesh}>
        <boxGeometry
          args={[xSize, ySize, zSize, xSegments, ySegments, zSegments]}
        />
        <meshStandardMaterial color="#1abc9c" />
      </mesh>
      <mesh ref={refWireMesh}>
        <meshStandardMaterial emissive="yellow" wireframe />
      </mesh>
    </>
  );
}

function Segments() {
  return (
    <Main>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 1, 3]} intensity={0.5} />
        <SegmentsMesh />
      </Canvas>
    </Main>
  );
}

export default Segments;
