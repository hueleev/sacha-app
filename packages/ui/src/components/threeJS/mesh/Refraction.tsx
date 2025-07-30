import { Canvas } from "@react-three/fiber";
import Main from "../Main";

import {
  CubeCamera,
  MeshRefractionMaterial,
  OrbitControls,
} from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { RGBELoader } from "three/examples/jsm/Addons.js";

function MyElement3D() {
  const texture = useLoader(
    RGBELoader,
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr"
  );

  const config = useControls({
    bounces: { value: 2, min: 0, max: 10, step: 1 },
    aberrationStrength: { value: 0.03, min: 0, max: 0.1, step: 0.01 },
    ior: { value: 2.75, min: 1, max: 2, step: 0.01 },
    fresnel: { value: 1, min: 0, max: 1, step: 0.01 },
    color: { value: "white", min: 0, max: 1, step: 0.01 },
    fastChroma: { value: true, min: 0, max: 1, step: 0.01 },
  });

  return (
    <Main>
      <Canvas>
        <OrbitControls />

        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 1, 0]} />
        <directionalLight position={[1, 2, 8]} intensity={0.7} />

        <CubeCamera resolution={1024} frames={1} envMap={texture}>
          {(texture) => (
            <mesh>
              <dodecahedronGeometry />
              <MeshRefractionMaterial
                envMap={texture}
                toneMapped={false}
                {...config}
              />
            </mesh>
          )}
        </CubeCamera>
      </Canvas>
    </Main>
  );
}

export default MyElement3D;
