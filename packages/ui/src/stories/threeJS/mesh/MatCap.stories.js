import MatCap from "../../../components/threeJS/mesh/MatCap";
import MatCapCode from "../../../components/threeJS/mesh/MatCap.tsx?raw";

const description = `
MatCap을 활용한 mesh입니다.

### 주요 기능
- **MatCap 텍스처**: 구체에 매핑된 조명 정보를 활용한 재질 표현
- **고성능 렌더링**: 복잡한 조명 계산 없이도 사실적인 재질 표현
- **다양한 재질**: 하나의 텍스처로 다양한 재질 효과 구현

### MatCap 시스템
- **구면 매핑**: 구체에 미리 렌더링된 조명 정보를 활용
- **실시간 성능**: 조명 계산 없이도 고품질 재질 표현
- **다양한 스타일**: 금속, 플라스틱, 세라믹 등 다양한 재질 표현 가능

### 사용된 기술
- Three.js MeshMatcapMaterial
- MatCap 텍스처 시스템
- 구면 매핑 기반 재질 표현

### 참고 자료
https://github.com/emmelleppi/matcaps

### Props
- **flatShading**: 평면 셰이딩 적용 여부 (boolean)
`;

export default {
  title: "threeJS/mesh/MatCap",
  component: MatCap,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
    argTypes: {
      flatShading: { control: "boolean" },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: `기본 MatCap 효과를 보여주는 스토리입니다. MatCap 텍스처를 활용한 사실적인 재질 표현을 확인할 수 있습니다.`,
      },
      source: {
        code: MatCapCode,
      },
    },
  },
  args: {
    flatShading: false,
  },
};
