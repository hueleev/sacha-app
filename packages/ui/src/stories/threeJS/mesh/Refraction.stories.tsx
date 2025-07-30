import { Canvas } from "@react-three/fiber";
import Main from "../../../components/threeJS/Main";
import Refraction from "../../../components/threeJS/mesh/Refraction";

import fs from "fs";
import path from "path";
// 컴포넌트 파일 내용을 읽어오는 함수
function getComponentSource() {
  try {
    const componentPath = path.join(
      __dirname,
      "../../../components/threeJS/mesh/Refraction"
    );
    return fs.readFileSync(componentPath, "utf-8");
  } catch (error) {
    return "// 컴포넌트 소스를 읽을 수 없습니다.";
  }
}

export default {
  title: "threeJS/mesh/Refraction",
  component: Refraction,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
리프랙션(굴절) 효과를 보여주는 Three.js 컴포넌트입니다.

## 주요 기능
- **MeshRefractionMaterial**: 굴절 효과를 구현하는 재질
- **CubeCamera**: 환경 맵을 생성하는 카메라
- **OrbitControls**: 마우스로 3D 객체를 회전/확대할 수 있는 컨트롤
- **Leva Controls**: 실시간으로 재질 속성을 조정할 수 있는 UI

## 컴포넌트 구조
- \`SceneLights\`: 조명 설정
- \`RefractionMesh\`: 굴절 메시 렌더링
- \`useRefractionControls\`: Leva 컨트롤 설정
        `,
      },
    },
  },
  argTypes: {
    // 컴포넌트의 props가 있다면 여기에 정의
  },
};

// export function Default() {
//   return (
//     <Main>
//       <Canvas>
//         <Refraction />
//       </Canvas>
//     </Main>
//   );
// }

export const Default = {
  parameters: {
    docs: {
      description: {
        story: `
## 컴포넌트 구조 상세 설명

### 1. SceneLights 컴포넌트
\`\`\`tsx
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 1, 0]} />
      <directionalLight position={[1, 2, 8]} intensity={0.7} />
    </>
  );
}
\`\`\`

### 2. RefractionMesh 컴포넌트
\`\`\`tsx
function RefractionMesh({ texture, config }) {
  return (
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
  );
}
\`\`\`

### 3. useRefractionControls 훅
\`\`\`tsx
function useRefractionControls() {
  return useControls({
    bounces: { value: 2, min: 0, max: 10, step: 1 },
    aberrationStrength: { value: 0.03, min: 0, max: 0.1, step: 0.01 },
    ior: { value: 2.75, min: 1, max: 2, step: 0.01 },
    fresnel: { value: 1, min: 0, max: 1, step: 0.01 },
    color: { value: "white", min: 0, max: 1, step: 0.01 },
    fastChroma: { value: true, min: 0, max: 1, step: 0.01 },
  });
}
\`\`\`
      `,
      },
      source: {
        code: getComponentSource(),
      },
    },
  },
};
