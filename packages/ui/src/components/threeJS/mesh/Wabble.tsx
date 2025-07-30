import { Canvas } from "@react-three/fiber";
import Main from "../Main";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";

function WabbleMesh() {
  return (
    <mesh>
      <torusGeometry />
      <MeshWobbleMaterial factor={1} speed={10} />
    </mesh>
  );
}

function Wabble() {
  return (
    <Main>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 1, 0]} />
        <directionalLight position={[1, 2, 8]} intensity={0.7} />
        <WabbleMesh />
      </Canvas>
    </Main>
  );
}

export default Wabble;
