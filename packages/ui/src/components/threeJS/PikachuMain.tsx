"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Pikachu from "./Pikachu";

export default function PikachuMain() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div style={{ width: "90vw", height: "90vh" }}>
        <Canvas camera={{ position: [0, 2, 10] }}>
          <ambientLight />
          <directionalLight position={[5, 10, 7]} intensity={0.7} />
          <Pikachu position={[0, 0, 0]} />
          <OrbitControls />
        </Canvas>
      </div>
    </main>
  );
}
