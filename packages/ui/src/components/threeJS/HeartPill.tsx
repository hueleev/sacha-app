import { useRef, useMemo } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

export default function HeartPill(props: ThreeElements["group"]) {
  const groupRef = useRef<THREE.Group>(null!);

  // 하트의 왼쪽 절반 2D shape 정의
  const leftShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.3);
    s.bezierCurveTo(0, 0.5, -0.5, 0.5, -0.5, 0.15);
    s.bezierCurveTo(-0.5, -0.2, 0, -0.2, 0, -0.5);
    s.lineTo(0, 0.3);
    return s;
  }, []);

  // 하트의 오른쪽 절반 2D shape 정의
  const rightShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(0, -0.2, 0.5, -0.2, 0.5, 0.15);
    s.bezierCurveTo(0.5, 0.5, 0, 0.5, 0, 0.3);
    s.lineTo(0, -0.5);
    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 4,
      steps: 2,
    }),
    [],
  );

  // Extrude geometry로 하트 입체화
  const leftGeometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(leftShape, extrudeSettings);
  }, [leftShape, extrudeSettings]);

  const rightGeometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(rightShape, extrudeSettings);
  }, [rightShape, extrudeSettings]);

  // 살짝 회전 애니메이션
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <mesh geometry={leftGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#FF4F6D" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh geometry={rightGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#FFEB3B" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}
