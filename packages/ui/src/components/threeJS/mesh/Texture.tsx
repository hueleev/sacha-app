import {Canvas} from "@react-three/fiber";
import Main from "../Main";
import {OrbitControls, useTexture} from "@react-three/drei";
import baseImage from "../../../assets/threeJS/glass/Glass_Window_002_basecolor.jpg";
import roughnessImage from "../../../assets/threeJS/glass/Glass_Window_002_roughness.jpg";
import metalicImage from "../../../assets/threeJS/glass/Glass_Window_002_metallic.jpg";
import * as THREE from "three";

function Glass3Mesh() {
    const textures = useTexture({
        map: baseImage,
        roughnessMap: roughnessImage,
        metallicMap: metalicImage,
    });

    return (
            <mesh>
                <cylinderGeometry args={[2, 2, 3, 16, 1, true]}/>
                <meshStandardMaterial
                        map={textures.map}
                        side={THREE.DoubleSide}
                        roughnessMap={textures.roughnessMap}
                        roughnessMap-colorSpace={THREE.NoColorSpace}
                        metalness={0.5}
                        metalnessMap={textures.metallicMap}
                        metalnessMap-colorSpace={THREE.NoColorSpace}
                />
            </mesh>
    );
}

function Texture() {
    return (
            <div style={{backgroundColor: "black"}}>
                <Main>
                    <Canvas>
                        <OrbitControls/>
                        <ambientLight intensity={0.2}/>
                        <directionalLight position={[0, 1, -8]} intensity={0.4}/>
                        <directionalLight position={[1, 2, 8]} intensity={0.4}/>
                        <Glass3Mesh/>
                    </Canvas>
                </Main>
            </div>
    );
}

export default Texture;
