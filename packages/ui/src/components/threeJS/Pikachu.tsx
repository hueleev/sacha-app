import { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Pikachu(props: ThreeElements["group"]) {
  const groupRef = useRef<THREE.Group>(null!);

  return (
    <group ref={groupRef} {...props}>
      {/* 몸통 */}
      <mesh position={[0, -0.7, 0]}>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 머리 */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 왼쪽 귀 */}
      <mesh position={[-0.7, 2.8, 0]} rotation={[0, 0, -0.18]}>
        <cylinderGeometry args={[0.15, 0.18, 1.3, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 왼쪽 귀 끝 검정 */}
      <mesh position={[-0.7, 3.4, 0]} rotation={[0, 0, -0.18]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 오른쪽 귀 */}
      <mesh position={[0.7, 2.8, 0]} rotation={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.15, 0.18, 1.3, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 오른쪽 귀 끝 검정 */}
      <mesh position={[0.7, 3.4, 0]} rotation={[0, 0, 0.18]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 왼쪽 볼 */}
      <mesh position={[-0.7, 0.8, 1.1]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#E94F37" />
      </mesh>
      {/* 오른쪽 볼 */}
      <mesh position={[0.7, 0.8, 1.1]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#E94F37" />
      </mesh>
      {/* 왼쪽 눈 */}
      <mesh position={[-0.45, 1.4, 1.2]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 왼쪽 눈 하이라이트 */}
      <mesh position={[-0.4, 1.5, 1.3]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* 오른쪽 눈 */}
      <mesh position={[0.45, 1.4, 1.2]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 오른쪽 눈 하이라이트 */}
      <mesh position={[0.5, 1.5, 1.3]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* 코 */}
      <mesh position={[0, 1.1, 1.3]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 입 */}
      <mesh position={[-0.09, 0.95, 1.25]} rotation={[0, 0, 0.5]}>
        <torusGeometry args={[0.08, 0.018, 8, 16, Math.PI / 1.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.09, 0.95, 1.25]} rotation={[0, 0, -0.5]}>
        <torusGeometry args={[0.08, 0.018, 8, 16, Math.PI / 1.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 왼쪽 팔(노트북 위에 올린 포즈) */}
      <mesh position={[-0.7, -0.1, 0.8]} rotation={[0.2, 0, 0.7]}>
        <cylinderGeometry args={[0.13, 0.16, 0.7, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 오른쪽 팔(노트북 위에 올린 포즈) */}
      <mesh position={[0.7, -0.1, 0.8]} rotation={[0.2, 0, -0.7]}>
        <cylinderGeometry args={[0.13, 0.16, 0.7, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 왼쪽 다리 */}
      <mesh position={[-0.4, -1.5, 0.4]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 오른쪽 다리 */}
      <mesh position={[0.4, -1.5, 0.4]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 꼬리(번개 모양) */}
      <mesh position={[1.3, 0.5, -0.7]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.22, 0.8, 0.13]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      <mesh position={[1.7, 1.0, -0.7]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.22, 0.5, 0.13]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      <mesh position={[1.95, 1.3, -0.7]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.22, 0.28, 0.13]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 꼬리 끝 갈색 */}
      <mesh position={[2.1, 1.5, -0.7]}>
        <boxGeometry args={[0.22, 0.15, 0.13]} />
        <meshStandardMaterial color="#8B6F1A" />
      </mesh>
      {/* 노트북 (간단한 box) */}
      <mesh position={[0, -0.5, 1.2]} rotation={[-0.7, 0, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.8]} />
        <meshStandardMaterial color="#d9d9d9" />
      </mesh>
      {/* 노트북 화면 */}
      <mesh position={[0, -0.1, 1.55]} rotation={[-1.2, 0, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.7]} />
        <meshStandardMaterial color="#bdbdbd" />
      </mesh>
    </group>
  );
}
