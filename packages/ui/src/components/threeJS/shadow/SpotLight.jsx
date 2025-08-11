import React, { useEffect, useRef } from 'react';
import Main from '../Main';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import * as THREE from 'three';

const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: '#9b59b6',
    roughness: 0.5,
    metalness: 0.9,
});

function MyElement3D() {
    const light = useRef();
    const { scene } = useThree();
    useFrame((state, delta) => {
        const smallSpherePivot = state.scene.getObjectByName('smallSpherePivot');
        smallSpherePivot.rotation.y += THREE.MathUtils.degToRad(delta * 50);
        smallSpherePivot.children[0].getWorldPosition(light.current.target.position);
    });

    useEffect(() => {
        scene.add(light.current.target);
        return () => {
            scene.remove(light.current.target);
        };
    }, [light.current]);

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.1} />
            <spotLight
                ref={light}
                shadow-mapSize={[1024 * 4, 1024 * 4]}
                shadow-radius={128}
                shadow-blurSamples={80}
                shadow-bias={-0.0001}
                castShadow
                color="#ffffff "
                intensity={80}
                position={[0, 5, 0]}
                angle={THREE.MathUtils.degToRad(60)}
            />

            {/* 판 */}
            <mesh receiveShadow rotation-x={THREE.MathUtils.degToRad(-90)}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial
                    color="#2c3e50"
                    roughness={0.5}
                    metalness={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 중앙 매듭 */}
            <mesh castShadow receiveShadow position-y={1.7}>
                <torusKnotGeometry args={[1, 0.2, 128, 32]} />
                <meshStandardMaterial color={0xffffff} roughness={0.1} metalness={0.2} />
            </mesh>

            {/* 10개의 링 */}
            {new Array(10).fill().map((item, index) => {
                return (
                    <group key={index} rotation-y={THREE.MathUtils.degToRad(index * 45)}>
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={torusGeometry}
                            material={torusMaterial}
                            position={[3, 0.5, 0]}
                        />
                    </group>
                );
            })}

            {/* 회전하는 공 */}
            <group name="smallSpherePivot">
                <mesh castShadow receiveShadow position={[3, 0.5, 0]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#e74c3c" roughness={0.2} metalness={0.5} />
                </mesh>
            </group>
        </>
    );
}

function DirectionalLight() {
    return (
        <Main darkMode>
            <Canvas
                shadows="variance"
                camera={{
                    near: 1,
                    far: 100,
                    position: [7, 7, 0],
                }}
            >
                <MyElement3D />
            </Canvas>
        </Main>
    );
}

export default DirectionalLight;
