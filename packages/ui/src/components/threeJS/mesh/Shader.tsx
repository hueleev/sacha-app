import { Canvas } from "@react-three/fiber";
import Main from "../Main";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// 버텍스 셰이더
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// 프래그먼트 셰이더
const fragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec2 uv = vUv;
    
    // 시간에 따라 변화하는 색상
    vec3 color = vec3(
      sin(time + uv.x * 3.14159) * 0.5 + 0.5,
      sin(time + uv.y * 3.14159) * 0.5 + 0.5,
      sin(time + (uv.x + uv.y) * 3.14159) * 0.5 + 0.5
    );
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderMesh() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
        }}
      />
    </mesh>
  );
}

function Shader() {
  return (
    <Main>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 1, 0]} />
        <directionalLight position={[1, 2, 8]} intensity={0.7} />
        <ShaderMesh />
      </Canvas>
    </Main>
  );
}

export default Shader;
