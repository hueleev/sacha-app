"use client";

import { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Pikachu(props: ThreeElements["group"]) {
  const groupRef = useRef<THREE.Group>(null!);

  return (
    <group ref={groupRef} {...props}>
      {/* 몸통 (더 통통하게) */}
      <mesh position={[0, -0.7, 0]}>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 머리 (더 크고 동그랗게) */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 왼쪽 귀 */}
      <mesh position={[-0.8, 3.3, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.18, 0.22, 1.7, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 왼쪽 귀 끝 검정 */}
      <mesh position={[-0.8, 4.1, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.18, 0.18, 0.5, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 오른쪽 귀 */}
      <mesh position={[0.8, 3.3, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.18, 0.22, 1.7, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 오른쪽 귀 끝 검정 */}
      <mesh position={[0.8, 4.1, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.18, 0.18, 0.5, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 왼쪽 볼 */}
      <mesh position={[-0.85, 1.1, 1.15]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#E94F37" />
      </mesh>
      {/* 오른쪽 볼 */}
      <mesh position={[0.85, 1.1, 1.15]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#E94F37" />
      </mesh>
      {/* 왼쪽 눈 */}
      <mesh position={[-0.55, 1.7, 1.35]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 왼쪽 눈 하이라이트 */}
      <mesh position={[-0.5, 1.8, 1.5]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* 오른쪽 눈 */}
      <mesh position={[0.55, 1.7, 1.35]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 오른쪽 눈 하이라이트 */}
      <mesh position={[0.6, 1.8, 1.5]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* 코 */}
      <mesh position={[0, 1.35, 1.5]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 입 (작은 반원 두 개로 입 표현) */}
      <mesh position={[-0.13, 1.13, 1.45]} rotation={[0, 0, 0.5]}>
        <torusGeometry args={[0.11, 0.025, 8, 16, Math.PI / 1.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.13, 1.13, 1.45]} rotation={[0, 0, -0.5]}>
        <torusGeometry args={[0.11, 0.025, 8, 16, Math.PI / 1.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* 왼쪽 팔 */}
      <mesh position={[-1.1, 0.3, 0.5]} rotation={[0, 0, 0.7]}>
        <cylinderGeometry args={[0.18, 0.22, 0.9, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 오른쪽 팔 */}
      <mesh position={[1.1, 0.3, 0.5]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.18, 0.22, 0.9, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 왼쪽 다리 */}
      <mesh position={[-0.5, -1.7, 0.4]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 오른쪽 다리 */}
      <mesh position={[0.5, -1.7, 0.4]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 꼬리(번개 모양, 노란색) */}
      <mesh position={[1.5, 0.7, -0.7]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.3, 1.1, 0.18]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      <mesh position={[2, 1.3, -0.7]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.3, 0.7, 0.18]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      <mesh position={[2.3, 1.7, -0.7]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.3, 0.4, 0.18]} />
        <meshStandardMaterial color="#FFD800" />
      </mesh>
      {/* 꼬리 끝 갈색 */}
      <mesh position={[2.5, 2, -0.7]}>
        <boxGeometry args={[0.3, 0.25, 0.18]} />
        <meshStandardMaterial color="#8B6F1A" />
      </mesh>
    </group>
  );
}
