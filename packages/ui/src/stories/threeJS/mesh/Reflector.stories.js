import Reflector from "../../../components/threeJS/mesh/Reflector";
import ReflectorCode from "../../../components/threeJS/mesh/Reflector.tsx?raw";

const description = `
반사 효과를 보여주는 컴포넌트입니다.

### 주요 기능
- **실시간 반사**: 주변 환경을 실시간으로 반사하는 효과
- **동적 반사**: 움직이는 물체의 반사도 실시간으로 처리
- **고품질 렌더링**: 고해상도 반사 맵을 통한 사실적인 반사

### 반사 시스템
- **환경 반사**: 주변 조명과 오브젝트를 반영
- **동적 업데이트**: 실시간으로 변화하는 반사 효과
- **성능 최적화**: 효율적인 반사 맵 생성 및 활용

### 사용된 기술
- @react-three/drei의 MeshReflectorMaterial
- 실시간 반사 맵 생성
- 고급 셰이더 시스템

### 참고 자료
https://drei.docs.pmnd.rs/shaders/mesh-reflector-material
`;

export default {
  title: "threeJS/mesh/Reflector",
  component: Reflector,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: `기본 Reflector 효과를 보여주는 스토리입니다. 실시간 반사 효과와 주변 환경의 반영을 확인할 수 있습니다.`,
      },
      source: {
        code: ReflectorCode,
      },
    },
  },
};
