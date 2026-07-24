import React, { useEffect, useRef } from 'react';
import Main from '../../Main';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {AccumulativeShadows, OrbitControls, RandomizedLight} from '@react-three/drei';

import * as THREE from 'three';

const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: '#9b59b6',
    roughness: 0.5,
    metalness: 0.9,
});

function MyElement3D() {
    useFrame((state, delta) => {
        const smallSpherePivot = state.scene.getObjectByName('smallSpherePivot');
        smallSpherePivot.rotation.y += THREE.MathUtils.degToRad(delta * 50);

    });

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.1} />
            <directionalLight color={0xffffff} intensity={3} position={[0,5,0]} />

            {/* 중앙 매듭 */}
            <mesh castShadow position-y={1.7}>
                <torusKnotGeometry args={[1, 0.2, 128, 32]} />
                <meshStandardMaterial color={0xffffff} roughness={0.1} metalness={0.2} />
            </mesh>

            {/* 10개의 링 */}
            {new Array(10).fill().map((item, index) => {
                return (
                    <group key={index} rotation-y={THREE.MathUtils.degToRad(index * 45)}>
                        <mesh
                            castShadow
                            geometry={torusGeometry}
                            material={torusMaterial}
                            position={[3, 0.5, 0]}
                        />
                    </group>
                );
            })}

            {/* 회전하는 공 */}
            <group name="smallSpherePivot">
                <mesh castShadow position={[3, 0.5, 0]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#e74c3c" roughness={0.2} metalness={0.5} />
                </mesh>
            </group>
        </>
    );
}

function Shadows() {
    return (
        <Main>
            <Canvas
                shadows
                camera={{
                    near: 1,
                    far: 100,
                    position: [7, 7, 0],
                }}
            >
                <MyElement3D />

                {/* 동적 */}
                <AccumulativeShadows
                    position={[0, 0.01, 0]}
                    scale={12}
                    color="#000000"
                    opacity={0.7}
                    alphaTest={1}
                    frames={Infinity}
                    temporal
                    blend={30}
                >
                    <RandomizedLight
                        radius={0.5}
                        ambient={0.21}
                        intensity={2.2}
                        position={[5, 3, 0]}
                    />

                    {/*<RandomizedLight*/}
                    {/*    amount={4}*/}
                    {/*    radius={0.5}*/}
                    {/*    ambient={0.21}*/}
                    {/*    intensity={2.6}*/}
                    {/*    position={[-5, 3, 0]}*/}
                    {/*/>*/}
                </AccumulativeShadows>
            </Canvas>
        </Main>
    );
}

export default Shadows;