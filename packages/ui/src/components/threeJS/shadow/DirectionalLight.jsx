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
    const shadowCamera = useRef();

    const { scene } = useThree();

    useFrame((state, delta) => {
        const smallSpherePivot = state.scene.getObjectByName('smallSpherePivot');
        smallSpherePivot.rotation.y += THREE.MathUtils.degToRad(delta * 80);
        // 피벗의 좌표를 광원에 지정 (작은 구체의 위치를 DirectionalLight의 타겟으로 설정)
        smallSpherePivot.children[0].getWorldPosition(light.current.target.position);
    });

    useEffect(() => {
        scene.add(light.current.target);
        shadowCamera.current = new THREE.CameraHelper(light.current.shadow.camera);
        scene.add(shadowCamera.current);
        return () => {
            scene.remove(light.current.target);
            scene.remove(shadowCamera.current);
        };
    }, [light.current]);

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.7} />
            <directionalLight
                ref={light}
                // 절두체 크기 늘려줌
                shadow-camera-top={6}
                shadow-camera-bottom={-6}
                shadow-camera-left={-6}
                shadow-camera-right={6}
                shadow-mapSize={[512 * 4, 512 * 4]}
                castShadow
                color={0xffffff}
                intensity={1.5}
                position={[0, 5, 0]}
                target-position={[0, 0, 0]}
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
                shadows
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
