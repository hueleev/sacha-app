import { Canvas } from '@react-three/fiber';
import Main from '../Main';
import { OrbitControls } from '@react-three/drei';
import matcap from '/public/assets/threeJS/mapcap.jpg';
import { useTexture } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type MatCapMeshProps = {
    flatShading: boolean;
};

function MatCapMesh(props: MatCapMeshProps) {
    const mapcap = useTexture(matcap);
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.MeshMatcapMaterial;
            material.flatShading = props.flatShading;
            material.needsUpdate = true;
        }
    }, [props.flatShading]);

    useEffect(() => {
        if (mapcap) {
            mapcap.colorSpace = THREE.SRGBColorSpace;
            mapcap.flipY = false;
            mapcap.needsUpdate = true;
        }
    }, [mapcap]);

    return (
        <mesh ref={meshRef} position={[0, 0, 2]}>
            <torusKnotGeometry args={[0.5, 0.15, 256, 128]} />
            <meshMatcapMaterial matcap={mapcap} flatShading={props.flatShading} />
        </mesh>
    );
}

function MatCap(props: MatCapMeshProps) {
    return (
        <Main>
            <Canvas>
                <OrbitControls />
                <ambientLight intensity={0.2} />
                <directionalLight position={[1, 2, 8]} intensity={0.7} />
                <directionalLight position={[0, 1, 0]} />
                <MatCapMesh {...props} />
            </Canvas>
        </Main>
    );
}

export default MatCap;
