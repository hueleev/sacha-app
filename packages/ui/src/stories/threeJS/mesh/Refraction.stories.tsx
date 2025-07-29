import Refraction from "../../../components/threeJS/mesh/Refraction";
import RefractionCode from "../../../components/threeJS/mesh/Refraction.tsx?raw";

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

export const Default = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
      source: {
        code: RefractionCode,
      },
    },
  },
};
