import { Canvas } from "@react-three/fiber";
import Box from "./Sample";
import { OrbitControls } from "@react-three/drei";

interface MainProps {
  color: string;
}

export default function SampleMain({ color }: MainProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div style={{ width: "100%", height: "100vh" }}>
        <Canvas
          camera={{
            position: [0, 5, 20],
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
