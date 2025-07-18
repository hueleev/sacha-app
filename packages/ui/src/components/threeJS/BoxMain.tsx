import { Canvas } from "@react-three/fiber";
import Box from "./Box";
import { OrbitControls } from "@react-three/drei";

interface MainProps {
  color: string;
}

export default function Main({ color }: MainProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div style={{ width: "90vw", height: "90vh" }}>
        <Canvas
          camera={{
            position: [0, 1, 10],
          }}
        >
          <ambientLight />
          <Box position={[0, 0, 0]} color={color} />
          <gridHelper args={[10, 10]} />
          <axesHelper args={[8]} />
          <OrbitControls />
        </Canvas>
      </div>
    </main>
  );
}
