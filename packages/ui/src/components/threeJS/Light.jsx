import React, {useEffect, useRef} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import Main from "./Main";
import {OrbitControls, useHelper} from "@react-three/drei";
import * as THREE from "three";

const torusGeometry = new THREE.TorusGeometry(0.4,0.1,32,32);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: "#9b59b6",
    roughness: 0.5,
    metalness: 0.9
})

function MeshObject({light}) {
    useFrame((state,delta) => {
        const time = state.clock.elapsedTime;
        const smallSpherePivot = state.scene.getObjectByName("smallSpherePivot");
        // smallSpherePivot.rotation.y += THREE.MathUtils.degToRad(delta * 100);
        smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50);
        if (typeof light.current !== "undefined" && light.current.type === "DirectionalLight" ) {
            // 피벗의 좌표를 광원에 지정
            smallSpherePivot.children[0].getWorldPosition(light.current.target.position);
        }
    });


    return (
        <>
            <mesh rotation-x={THREE.MathUtils.degToRad(-90)}>
                <planeGeometry args={[10, 10]}/>
                <meshStandardMaterial color="#2c3e50" roughness={0.5} metalness={0.5} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation-x={THREE.MathUtils.degToRad(-90)}>
                <sphereGeometry args={[1.5, 64, 64, 0, Math.PI]}/>
                <meshStandardMaterial color="white" roughness={0.1} metalness={0.2} />
            </mesh>

            {
                new Array(8).fill().map((item,index)=> {
                    return (
                            <group key={index} rotation-y={THREE.MathUtils.degToRad(index*45)}>
                            <mesh
                                geometry={torusGeometry}
                                material={torusMaterial}
                                position={[3,0.5,0]}
                            />
                           </group>
                    )
                })
            }

            <group name="smallSpherePivot">
                <mesh position={[3,0.5,0]}>
                    <sphereGeometry args={[0.3,32,32]}/>
                    <meshStandardMaterial color="#e74c3c" roughness={0.2} metalness={0.5} />
                </mesh>
            </group>
        </>
    )
}

function AmbientLight() {
    return <ambientLight color="#ffffff" intensity={10}/>;
}

function HemisphereLight() {
    return <hemisphereLight args={["#00f", "#f00", 5]}/>;
}

function DirectionalLight({light}) {
    useHelper(light, THREE.DirectionalLightHelper);
    const {scene} = useThree();

    useEffect(() => {
        if (light.current) {
            const directionalLightInstance = light.current;
            if (directionalLightInstance.target) {
                scene.add(directionalLightInstance.target);
                return () => {
                    scene.remove(directionalLightInstance.target);
                };
            }
        }
    }, [light, scene]);
    return <directionalLight ref={light} color="#ffffff" intensity={5} position={[0, 5, 0]} target-position={[1, 0, 0]}/>;
}

function PointLight({light}) {
    useHelper(light, THREE.PointLightHelper, 1);
    return <pointLight ref={light} color="#ffffff" intensity={200} position={[0, 5, 0]}/>;
}

function Light ({ambientLight = true, hemisphereLight = false, directionalLight = false, pointLight = false}) {
    const light = useRef();
    return (
        <div style={{backgroundColor: "black"}}>
            <Main>
                <Canvas camera={{ fov: 75, position: [7, 7, 0] }}>
                    <OrbitControls/>
                    {/*<LightComponent {...props} light={light}/>*/}
                    {ambientLight && <AmbientLight/>}
                    {hemisphereLight && <HemisphereLight/>}
                    {directionalLight && <DirectionalLight light={light}/>}
                    {pointLight && <PointLight light={light}/>}
                    <MeshObject light={light} />
                </Canvas>
            </Main>
        </div>
    )
}

export default Light;