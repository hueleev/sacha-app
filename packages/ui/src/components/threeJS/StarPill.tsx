import { useRef, useMemo } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

function createStarShape(radius = 0.5, points = 5, inset = 0.22) {
  const shape = new THREE.Shape();
  const step = Math.PI / points;
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? radius : radius * inset;
    const a = i * step - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

export default function StarPill(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const shape = useMemo(() => createStarShape(0.5, 5, 0.45), []);
  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.07,
      bevelSegments: 4,
      steps: 2,
    });
  }, [shape]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.012;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} {...props} castShadow receiveShadow>
      <meshStandardMaterial color="#FFD93A" roughness={0.25} metalness={0.55} />
    </mesh>
  );
}
