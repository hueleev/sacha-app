/**
 * Light.jsx
 *
 * 이 컴포넌트는 Three.js를 사용하여 다양한 3D 조명 효과를 시연하는 인터랙티브 장면을 구현합니다.
 * 사용자는 여러 종류의 조명(AmbientLight, HemisphereLight, DirectionalLight, PointLight)을
 * 활성화하여 3D 객체에 미치는 영향을 확인할 수 있습니다.
 */

import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Main from './Main';
import { OrbitControls, useHelper, Environment } from '@react-three/drei';
import * as THREE from 'three';

import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

import envFile from '/public/assets/threeJS/rogland_clear_night_4k.hdr';

// 도넛 모양의 기하학적 객체 정의 (반지름 0.4, 튜브 반지름 0.1, 분할 수 32x32)
const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
// 도넛 객체의 재질 정의 (보라색, 중간 정도의 거칠기, 높은 금속성)
const torusMaterial = new THREE.MeshStandardMaterial({
    color: '#9b59b6',
    roughness: 0.5,
    metalness: 0.9,
});

RectAreaLightUniformsLib.init();
/**
 * 3D 장면의 메시 객체들을 렌더링하는 컴포넌트
 * 바닥 평면, 반구체, 8개의 도넛 모양 객체, 그리고 회전하는 작은 구체를 포함합니다.
 * 작은 구체는 광원의 타겟 또는 위치로 사용됩니다.
 *
 * @param {Object} light - 광원에 대한 참조 객체
 */
export function MeshObject({ light }) {
    const { scene } = useThree();

    // light 타겟을 씬에 추가하고, 컴포넌트 언마운트 시 제거
    useEffect(() => {
        if (light.current) {
            const lightInstance = light.current;
            if (lightInstance.target) {
                scene.add(lightInstance.target);
                return () => {
                    scene.remove(lightInstance.target);
                };
            }
        }
    }, [light]);

    // 애니메이션 프레임마다 실행되는 함수
    useFrame((state, delta) => {
        const time = state.clock.elapsedTime; // 경과 시간
        const smallSpherePivot = state.scene.getObjectByName('smallSpherePivot'); // 작은 구체의 피벗 그룹 참조
        // smallSpherePivot.rotation.y += THREE.MathUtils.degToRad(delta * 100);
        smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50); // 시간에 따라 피벗 회전 (초당 50도)

        // 광원이 존재하는 경우 처리
        if (typeof light.current !== 'undefined') {
            const lightType = light.current.type;
            if (lightType === 'DirectionalLight') {
                // 피벗의 좌표를 광원에 지정 (작은 구체의 위치를 DirectionalLight의 타겟으로 설정)
                smallSpherePivot.children[0].getWorldPosition(light.current.target.position);
            } else if (lightType === 'PointLight') {
                // 작은 구체의 위치를 PointLight의 위치로 설정
                smallSpherePivot.children[0].getWorldPosition(light.current.position);
            } else if (lightType === 'SpotLight') {
                smallSpherePivot.children[0].getWorldPosition(light.current.target.position);
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
            {new Array(8).fill().map((item, index) => {
                return (
                    <group key={index} rotation-y={THREE.MathUtils.degToRad(index * 45)}>
                        <mesh
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

/**
 * 주변광(Ambient Light) 컴포넌트
 * 장면 전체에 균일하게 적용되는 기본 조명으로, 그림자를 생성하지 않습니다.
 * 모든 객체에 기본적인 밝기를 제공합니다.
 */
function AmbientLight() {
    return <ambientLight color="#ffffff" intensity={10} />;
}

/**
 * 반구광(Hemisphere Light) 컴포넌트
 * 하늘색(파란색)과 지면색(빨간색)을 가진 조명으로, 자연스러운 환경 조명을 시뮬레이션합니다.
 * 위쪽에서는 파란색, 아래쪽에서는 빨간색 조명이 비춥니다.
 */
function HemisphereLight() {
    return <hemisphereLight args={['#00f', '#f00', 5]} />;
}

/**
 * 방향광(Directional Light) 컴포넌트
 * 태양과 같이 멀리서 오는 평행한 광선을 시뮬레이션합니다.
 * 광원의 위치와 타겟 위치에 따라 방향이 결정되며, 그림자를 생성할 수 있습니다.
 *
 * @param {Object} light - 광원에 대한 참조 객체
 */
function DirectionalLight({ light }) {
    // DirectionalLight의 시각적 헬퍼를 추가하여 디버깅을 용이하게 함
    useHelper(light, THREE.DirectionalLightHelper);

    return (
        <directionalLight
            ref={light}
            color="#ffffff"
            intensity={5}
            position={[0, 5, 0]}
            target-position={[1, 0, 0]}
        />
    );
}

/**
 * 점광원(Point Light) 컴포넌트
 * 전구와 같이 모든 방향으로 빛을 발산하는 광원입니다.
 * 위치에서부터 거리에 따라 빛의 강도가 감소합니다.
 *
 * @param {Object} light - 광원에 대한 참조 객체
 */
function PointLight({ light }) {
    // PointLight의 시각적 헬퍼를 추가하여 디버깅을 용이하게 함 (크기 1)
    useHelper(light, THREE.PointLightHelper, 1);
    return (
        <pointLight ref={light} color="#ffffff" intensity={200} position={[0, 5, 0]} distance={0} />
    );
}

/**
 * 스포트라이트(Spot Light) 컴포넌트
 * 원뿔 모양으로 빛을 방출하는 광원으로, 특정 영역을 집중적으로 비춥니다.
 * 위치, 방향, 각도, 그리고 페넘브라(빛의 가장자리 부드러움)를 조절할 수 있습니다.
 *
 * @param {Object} light - 광원에 대한 참조 객체
 */
function SpotLight({ light }) {
    useHelper(light, THREE.SpotLightHelper);
    return (
        <spotLight
            ref={light}
            color="#ffffff"
            intensity={50}
            position={[0, 5, 0]}
            target-position={[0, 0, 0]}
            distance={0}
            angle={THREE.MathUtils.degToRad(50)}
            penumbra={0}
        />
    );
}

/**
 * 사각형 영역 조명(RectArea Light) 컴포넌트
 * 사각형 모양의 면에서 빛을 방출하는 광원으로, 형광등이나 창문에서 들어오는 빛과 유사합니다.
 * 너비, 높이, 위치, 회전 등을 조절하여 다양한 조명 효과를 만들 수 있습니다.
 *
 * @param {Object} light - 광원에 대한 참조 객체
 */
export function RectAreaLight({ light }) {
    useHelper(light, RectAreaLightHelper);
    return (
        <rectAreaLight
            ref={light}
            color="#ffffff"
            intensity={20}
            width={1}
            height={3}
            position={[0, 5, 0]}
            rotation-x={THREE.MathUtils.degToRad(-90)}
        />
    );
}

/**
 * 환경 조명(Environment Light) 컴포넌트
 * HDR 이미지를 사용하여 장면에 환경 조명과 배경을 제공합니다.
 * 실제 세계의 조명 환경을 시뮬레이션하여 자연스러운 조명과 반사 효과를 만듭니다.
 *
 * @param {Object} light - 광원에 대한 참조 객체
 */
function EnvironmentLight({ light }) {
    return <Environment blur={0} files={envFile} background />;
}

/**
 * 메인 Light 컴포넌트
 * 다양한 Three.js 조명 타입을 시연하는 3D 장면을 렌더링합니다.
 * 사용자는 여러 조명 타입을 활성화/비활성화하여 3D 객체에 미치는 영향을 확인할 수 있습니다.
 *
 * @param {Object} props - 컴포넌트 속성
 * @param {boolean} props.ambientLight - 주변광 활성화 여부 (기본값: true)
 * @param {boolean} props.hemisphereLight - 반구광 활성화 여부 (기본값: false)
 * @param {boolean} props.directionalLight - 방향광 활성화 여부 (기본값: false)
 * @param {boolean} props.pointLight - 점광원 활성화 여부 (기본값: false)
 * @param {boolean} props.spotLight - 스포트라이트 활성화 여부 (기본값: false)
 * @param {boolean} props.rectAreaLight - 사각형 영역 조명 활성화 여부 (기본값: false)
 * @param {boolean} props.environmentLight - 환경 조명 활성화 여부 (기본값: false)
 */
function Light({
    ambientLight = true,
    hemisphereLight = false,
    directionalLight = false,
    pointLight = false,
    spotLight = false,
    rectAreaLight = false,
    environmentLight = false,
}) {
    // 광원에 대한 참조를 생성하여 MeshObject와 광원 컴포넌트 간에 공유
    const light = useRef();

    return (
        <div style={{ backgroundColor: 'black' }}>
            <Main>
                {/* 3D 장면을 렌더링하는 Canvas, 카메라 설정 (시야각 75도, 위치 [7,7,0]) */}
                <Canvas camera={{ fov: 75, position: [7, 7, 0] }}>
                    {/* 마우스로 장면을 회전, 확대/축소할 수 있는 컨트롤 */}
                    <OrbitControls />
                    {/*<LightComponent {...props} light={light}/>*/}
                    {/* 조명 타입들을 조건부로 렌더링 */}
                    {ambientLight && <AmbientLight />}
                    {hemisphereLight && <HemisphereLight />}
                    {directionalLight && <DirectionalLight light={light} />}
                    {pointLight && <PointLight light={light} />}
                    {spotLight && <SpotLight light={light} />}
                    {rectAreaLight && <RectAreaLight light={light} />}
                    {environmentLight && <EnvironmentLight light={light} />}
                    {/* 3D 객체들을 렌더링 */}
                    <MeshObject light={light} />
                </Canvas>
            </Main>
        </div>
    );
}

export default Light;
