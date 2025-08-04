import {Canvas} from "@react-three/fiber";
import Main from "../Main";
import {OrbitControls, useTexture} from "@react-three/drei";
import * as THREE from "three";
import {useEffect, useRef} from "react";
import {Mesh} from "three";

import baseImage from "../../../assets/threeJS/glass/Glass_Window_002_basecolor.jpg";
import roughnessImage from "../../../assets/threeJS/glass/Glass_Window_002_roughness.jpg";
import metalicImage from "../../../assets/threeJS/glass/Glass_Window_002_metallic.jpg";
import normalImage from "../../../assets/threeJS/glass/Glass_Window_002_normal.jpg"
import heightImage from "../../../assets/threeJS/glass/Glass_Window_002_height.png";
import ambientImage from "../../../assets/threeJS/glass/Glass_Window_002_ambientOcclusion.jpg";
import opacityImage from "../../../assets/threeJS/glass/Glass_Window_002_opacity.jpg";

interface Glass3MeshProps {
    useBaseMap?: boolean;
    useRoughnessMap?: boolean;
    useMetallicMap?: boolean;
    useNormalMap?: boolean;
    useDisplacementMap?: boolean;
    useAmbientMap?: boolean;
    useAlphaMap?: boolean;
    metalness?: number;
    roughness?: number;
    normalScale?: number;
    displacementScale?: number;
    displacementBias?: number;
}

function Glass3Mesh({
        useBaseMap = true,
        useRoughnessMap = true,
        useMetallicMap = true,
        useNormalMap = true,
        useDisplacementMap = true,
        useAmbientMap = false,
        useAlphaMap = false,
        metalness = 0.5,
        roughness = 1,
        normalScale = 1,
        displacementScale = 0.2,
        displacementBias = -0.2,
    }: Glass3MeshProps) {
    const textures = useTexture({
        map: baseImage,
        roughnessMap: roughnessImage,
        metallicMap: metalicImage,
        normalMap: normalImage,
        displacementMap: heightImage,
        ambientMap: ambientImage,
        alphaMap: opacityImage,
    });

    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    useEffect(() => {
        if (materialRef.current) {
            const material = materialRef.current;

            // 기본 속성 설정
            material.side = THREE.DoubleSide;
            material.roughness = roughness;
            material.metalness = metalness;

            // 맵 설정
            material.map = useBaseMap ? textures.map : null;

            if (useRoughnessMap) {
                material.roughnessMap = textures.roughnessMap;
                material.roughnessMap!.colorSpace = THREE.NoColorSpace;
            } else {
                material.roughnessMap = null;
            }

            if (useMetallicMap) {
                material.metalnessMap = textures.metallicMap;
                material.metalnessMap!.colorSpace = THREE.NoColorSpace;
            } else {
                material.metalnessMap = null;
            }

            if (useNormalMap) {
                material.normalMap = textures.normalMap;
                material.normalMap!.colorSpace = THREE.NoColorSpace;
                material.normalScale.set(normalScale, normalScale);
            } else {
                material.normalMap = null;
            }

            if (useDisplacementMap) {
                material.displacementMap = textures.displacementMap;
                material.displacementMap!.colorSpace = THREE.NoColorSpace;
                material.displacementScale = displacementScale;
                material.displacementBias = displacementBias;
            } else {
                material.displacementMap = null;
            }

            if (useAmbientMap) {
                material.aoMap = textures.ambientMap;
            } else {
                material.aoMap = null;
            }

            if (useAlphaMap) {
                material.alphaMap = textures.alphaMap;
                material.transparent = true;
                material.alphaToCoverage = true;
            } else {
                material.alphaMap = null;
                material.transparent = false;
                material.alphaToCoverage = false;
            }

            material.needsUpdate = true;
        }
    }, [
        useBaseMap, useRoughnessMap, useMetallicMap, useNormalMap, useDisplacementMap, useAmbientMap, useAlphaMap,
        metalness, roughness, normalScale, displacementScale, displacementBias,
        textures
    ]);

    const mesh = useRef<Mesh>(null);

    useEffect(() => {
        textures.map.repeat.x = textures.displacementMap.repeat.x =
        textures.ambientMap.repeat.x = textures.roughnessMap.repeat.x =
        textures.metallicMap.repeat.x = textures.normalMap.repeat.x =
        textures.alphaMap.repeat.x = 4;

        textures.map.wrapS = textures.displacementMap.wrapS =
        textures.ambientMap.wrapS = textures.roughnessMap.wrapS =
        textures.metallicMap.wrapS = textures.normalMap.wrapS =
        textures.alphaMap.wrapS = THREE.MirroredRepeatWrapping;

        if (mesh.current && mesh.current.geometry.attributes.uv2 === undefined && mesh.current.geometry.attributes.uv) {
            mesh.current.geometry.setAttribute("uv2",
                    new THREE.BufferAttribute(mesh.current.geometry.attributes.uv.array, 2))
        }
    }, [])

    return (
        <mesh ref={mesh}>
            <cylinderGeometry args={[2, 2, 3, 256, 256, true]}/>
            <meshStandardMaterial ref={materialRef}/>
        </mesh>
    );
}

interface TextureProps extends Glass3MeshProps {
}

function Texture(props: TextureProps) {
    return (
        <div style={{backgroundColor: "black"}}>
            <Main>
                <Canvas>
                    <OrbitControls/>
                    <ambientLight intensity={0.2}/>
                    <directionalLight position={[0, 1, -8]} intensity={0.4}/>
                    <directionalLight position={[1, 2, 8]} intensity={0.4}/>
                    <Glass3Mesh {...props}/>
                </Canvas>
            </Main>
        </div>
    );
}

export default Texture;
