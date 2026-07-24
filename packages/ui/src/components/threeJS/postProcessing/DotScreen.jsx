import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { DotScreen, EffectComposer } from '@react-three/postprocessing';
import { useControls } from 'leva';
import Main from '../Main';

// 도넛 모양의 기하학적 객체 정의 (반지름 0.4, 튜브 반지름 0.1, 분할 수 32x32)
const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
// 도넛 객체의 재질 정의 (보라색, 중간 정도의 거칠기, 높은 금속성)
const torusMaterial = new THREE.MeshStandardMaterial({
    color: '#9b59b6',
    roughness: 0.5,
    metalness: 0.9,
});

function MyElement3D() {
    // 애니메이션 프레임마다 실행되는 함수
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime; // 경과 시간
        const smallSpherePivot = state.scene.getObjectByName('smallSpherePivot'); // 작은 구체의 피벗 그룹 참조
        smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50); // 시간에 따라 피벗 회전 (초당 50도)
    });

    const { angle, scale } = useControls('dotScreen', {
        angle: { value: 1.57, min: 0, max: Math.PI * 2, step: 0.1 },
        scale: { value: 1.57, min: 0, max: 10, step: 0.1 },
    });

    return (
        <>
            <OrbitControls />

            {/* PostProcessing */}
            <EffectComposer disableNormalPass>
                <DotScreen angle={angle} scale={scale} />
            </EffectComposer>

            <ambientLight intensity={0.5} />
            <directionalLight
                castShadow
                color={0xffffff}
                intensity={2.2}
                position={[-3, 3, 3]}
                shadow-mapSize={[1024 * 2, 1024 * 2]}
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

            {/* 매듭 */}
            <mesh castShadow receiveShadow position-y={0.6} rotation-x={-Math.PI / 2}>
                <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
                <meshStandardMaterial
                    color="#ffffff"
                    roughness={0.1}
                    metalness={0.6}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 도넛 모양의 객체를 10개 생성하여 회전시키며 배치 */}
            {new Array(10).fill().map((item, index) => {
                return (
                    <group key={index} rotation-y={THREE.MathUtils.degToRad(45 * index)}>
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

            {/* 회전하는 작은 빨간 구체 (광원의 타겟 또는 위치로 사용됨) */}
            <group name="smallSpherePivot">
                <mesh position={[3, 0.5, 0]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#e74c3c" roughness={0.2} metalness={0.5} />
                </mesh>
            </group>
        </>
    );
}

function Post() {
    return (
        <Main darkMode>
            <Canvas shadows camera={{ position: [7, 7, 0] }}>
                <MyElement3D />
            </Canvas>
        </Main>
    );
}

export default Post;
