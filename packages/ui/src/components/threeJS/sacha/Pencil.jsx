import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import Main from '../Main';
import { useControls } from 'leva';

const glassMesh = new THREE.MeshPhysicalMaterial({
    visible: true,
    transparent: true,
    opacity: 1,
    color: 0xffffff,
    emissive: 0x000000,
    side: THREE.DoubleSide,
    transmission: 1,
    ior: 1.5,
});
function Element3D() {
    const config = useControls({
        roughness: { value: 0, min: 0, max: 1, step: 0.01 },
        metalness: { value: 0, min: 0, max: 1, step: 0.01 },
        clearcoat: { value: 0, min: 0, max: 1, step: 0.01 },
        clearcoatRoughness: { value: 0, min: 0, max: 1, step: 0.01 },
        transmission: { value: 1, min: 0, max: 1, step: 0.01 },
        thickness: { value: 0.1, min: 0, max: 1, step: 0.01 },
        ior: { value: 1.5, min: 1, max: 2, step: 0.01 },
    });
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime; // 경과 시간
        const pencil = state.scene.getObjectByName('pencil'); // 연필 객체 참조
        pencil.rotation.y = THREE.MathUtils.degToRad(time * 50); // 시간
    });
    return (
        <>
            <group name="pencil" rotation-z={THREE.MathUtils.degToRad(45)} scale={5}>
                <mesh>
                    <cylinderGeometry args={[0.1, 0.1, 0.7]} />
                    {/* <meshStandardMaterial color="yellow" /> */}
                    <meshPhysicalMaterial
                        visible={true}
                        transparent={true}
                        opacity={1}
                        color={0xffffff}
                        emissive={0x000000}
                        side={THREE.DoubleSide}
                        {...config}
                    />
                </mesh>

                <mesh position={[0, -0.4, 0]} rotation-x={Math.PI}>
                    {/* <coneGeometry args={[0.1, 0.2, 32]} /> */}
                    <cylinderGeometry args={[0.05, 0.1, 0.1]} />
                    <meshPhysicalMaterial
                        visible={true}
                        transparent={true}
                        opacity={1}
                        color={0xffffff}
                        emissive={0x000000}
                        side={THREE.DoubleSide}
                        {...config}
                    />
                </mesh>

                <mesh position={[0, -0.5, 0]} rotation-x={Math.PI}>
                    <coneGeometry args={[0.05, 0.1, 32]} />
                    <meshPhysicalMaterial
                        visible={true}
                        transparent={true}
                        opacity={0.3}
                        color="black"
                        emissive={0x000000}
                        side={THREE.DoubleSide}
                        {...config}
                    />
                </mesh>
            </group>
        </>
    );
}
function Pencil() {
    return (
        <Main>
            <Canvas>
                <OrbitControls />
                {/* <ambientLight intensity={0.5} />
                <directionalLight
                    castShadow
                    color={0xffffff}
                    intensity={2.2}
                    position={[-3, 3, 3]}
                    shadow-mapSize={[1024 * 2, 1024 * 2]}
                /> */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 1, 0]} />
                <directionalLight position={[1, 2, 8]} intensity={0.7} />
                <Element3D />
            </Canvas>
        </Main>
    );
}

export default Pencil;
