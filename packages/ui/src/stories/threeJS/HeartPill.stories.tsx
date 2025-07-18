import React from "react";
import { Canvas } from "@react-three/fiber";
import HeartPill from "../../components/threeJS/HeartPill";

export default {
  title: "threeJS/HeartPill",
  component: HeartPill,
};

export function Default() {
  return (
    <div style={{ width: 320, height: 320 }}>
      <Canvas camera={{ position: [0, 0, 2.5] }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} castShadow />
        <HeartPill position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
} 