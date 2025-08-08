import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

import Main from '../Main.js';
import { useControls } from 'leva';
import * as THREE from 'three';
import { OrbitControls, useHelper } from '@react-three/drei';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

// 도넛 모양의 기하학적 객체 정의 (반지름 0.4, 튜브 반지름 0.1, 분할 수 32x32)
const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
// 도넛 객체의 재질 정의 (보라색, 중간 정도의 거칠기, 높은 금속성)
const torusMaterial = new THREE.MeshStandardMaterial({
    color: '#9b59b6',
    roughness: 0.5,
    metalness: 0.9,
});

RectAreaLightUniformsLib.init();

function MeshObject({ light, isSphere }) {
    useHelper(light, RectAreaLightHelper);
    const { camera } = useThree();

    // 애니메이션 프레임마다 실행되는 함수
    useFrame((state) => {
        const time = state.clock.elapsedTime; // 경과 시간
        const smallSpherePivot = state.scene.getObjectByName('smallSpherePivot'); // 작은 구체의 피벗 그룹 참조
        if (smallSpherePivot) {
            smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50); // 시간에 따라 피벗 회전 (초당 50도)
        }

        if (isSphere) {
            const target = new THREE.Vector3();
            if (smallSpherePivot && smallSpherePivot.children[0]) {
                smallSpherePivot.children[0].getWorldPosition(target);
                camera.position.copy(target);

                const ghostSpherePivot = state.scene.getObjectByName('ghostSpherePivot');
                if (ghostSpherePivot && ghostSpherePivot.children[0]) {
                    ghostSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50 + 30);
                    ghostSpherePivot.children[0].getWorldPosition(target);
                    camera.lookAt(target);
                }
            }
        }
    });

    return (
        <>
            {/* 바닥 평면 (10x10 크기, 어두운 회색) */}
            <mesh rotation-x={THREE.MathUtils.degToRad(-90)}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial
                    color="#2c3e50"
                    roughness={0.5}
                    metalness={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 반구체 (반지름 1.5, 흰색) */}
            <mesh rotation-x={THREE.MathUtils.degToRad(-90)}>
                <sphereGeometry args={[1.5, 64, 64, 0, Math.PI]} />
                <meshStandardMaterial color="white" roughness={0.1} metalness={0.2} />
            </mesh>

            {/* 8개의 도넛 모양 객체를 원형으로 배치 (45도 간격) */}
            {new Array(8).fill().map((item, index) => (
                <group key={index} rotation-y={THREE.MathUtils.degToRad(index * 45)}>
                    <mesh
                        geometry={torusGeometry}
                        material={torusMaterial}
                        position={[3, 0.5, 0]}
                    />
                </group>
            ))}

            {/* 회전하는 작은 빨간 구체 (광원의 타겟 또는 위치로 사용됨) */}
            <group name="smallSpherePivot">
                <mesh position={[3, 0.5, 0]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#e74c3c" roughness={0.2} metalness={0.5} />
                </mesh>
            </group>

            <group name="ghostSpherePivot">
                <object3D position={[3, 0.5, 0]} />
            </group>

            <rectAreaLight
                ref={light}
                color="#ffffff"
                intensity={20}
                width={1}
                height={3}
                position={[0, 5, 0]}
                rotation-x={THREE.MathUtils.degToRad(-90)}
            />
        </>
    );
}
function CameraUpdater({ fov, near, far, isSphere }) {
    const { camera } = useThree();

    // storybook args 사용
    useEffect(() => {
        if (isSphere) {
            camera.fov = fov;
        } else {
            camera.fov = 75; // isSphere가 false일 때 fov를 75로 리셋
        }
        camera.near = near;
        camera.far = far;
        camera.updateProjectionMatrix();
    }, [fov, near, far, camera, isSphere]);

    // leva 사용
    useControls({
        positionZ: {
            value: 0,
            min: -10,
            max: 10,
            step: 0.1,
            onChange: (v) => (camera.position.z = v),
        },
        targetZ: {
            value: 0,
            min: -10,
            max: 10,
            step: 0.1,
            onChange: (v) => camera.lookAt(0, 0, v),
        },
    });
    return null;
}

function Perspective({ fov = 75, near = 0.1, far = 20, isSphere = false }) {
    const light = useRef();
    const controlsRef = useRef();

    useEffect(() => {
        if (!isSphere && controlsRef.current) {
            controlsRef.current.reset();
        }
    }, [isSphere]);

    return (
        <div style={{ backgroundColor: 'black' }}>
            <Main>
                <Canvas camera={{ position: [7, 7, 0], fov: 75 }}>
                    <CameraUpdater fov={fov} near={near} far={far} isSphere={isSphere} />
                    <MeshObject light={light} isSphere={isSphere} />
                    <OrbitControls ref={controlsRef} enabled={!isSphere} />
                </Canvas>
            </Main>
        </div>
    );
}

export default Perspective;
