import Glass from "../../../components/threeJS/mesh/Glass";
import GlassCode from "../../../components/threeJS/mesh/Glass.tsx?raw";

const description = `
Glass 효과를 보여주는 컴포넌트입니다.

### 주요 기능
- **투명도 효과**: 물체가 유리처럼 투명하게 보이는 효과
- **반사 효과**: 주변 환경을 반사하는 유리 재질 표현
- **굴절 효과**: 빛이 유리를 통과할 때 발생하는 굴절 현상

### 카메라 설정
- **Near (근평면)**: 3.5 단위
  - 카메라에서 가장 가까운 렌더링 거리
  - 이 거리보다 가까운 객체는 렌더링되지 않음
- **Far (원평면)**: 6 단위
  - 카메라에서 가장 먼 렌더링 거리
  - 이 거리보다 먼 객체는 렌더링되지 않음

### 사용된 기술
- Three.js MeshStandardMaterial
- 투명도 및 반사 속성 활용
- 조명과의 상호작용으로 유리 효과 구현
`;

export default {
  title: "threeJS/mesh/Glass",
  component: Glass,
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
        story: `기본 Glass 효과를 보여주는 스토리입니다. 유리 재질의 투명도와 반사 효과를 확인할 수 있습니다.`,
      },
      source: {
        code: GlassCode,
      },
    },
  },
};
