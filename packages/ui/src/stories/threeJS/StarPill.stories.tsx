import React from "react";
import { Canvas } from "@react-three/fiber";
import StarPill from "../../components/threeJS/StarPill";

export default {
  title: "threeJS/StarPill",
  component: StarPill,
};

export function Default() {
  return (
    <div style={{ width: 320, height: 320 }}>
      <Canvas camera={{ position: [0, 0, 2.5] }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} castShadow />
        <StarPill position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
} 