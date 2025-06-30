"use client";

import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

type BoxProps = ThreeElements["mesh"] & {
  color?: string;
};

export default function Box(props: BoxProps) {
  const { color = "orange", ...rest } = props;
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <mesh
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      {...rest}
    >
      <boxGeometry args={[5, 5, 5]} />
      <meshStandardMaterial color={hovered ? "hotpink" : color} />
    </mesh>
  );
}
