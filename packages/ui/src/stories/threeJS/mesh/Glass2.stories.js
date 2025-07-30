import Glass2 from "../../../components/threeJS/mesh/Glass2";
import Glass2Code from "../../../components/threeJS/mesh/Glass2.tsx?raw";

const description = `
Glass2 효과를 보여주는 컴포넌트입니다.

### 주요 기능
- **고급 유리 효과**: 더욱 사실적인 유리 재질 표현
- **다중 반사**: 여러 층의 반사 효과로 깊이감 구현
- **조명 반응**: 다양한 조명 조건에서 자연스러운 유리 효과

### 특징
- 기존 Glass 컴포넌트의 개선된 버전
- 더 정교한 투명도와 반사 처리
- 성능 최적화된 렌더링 방식

### 사용된 기술
- Three.js 고급 재질 시스템
- 다중 패스 렌더링
- 최적화된 셰이더 활용
`;

export default {
  title: "threeJS/mesh/Glass2",
  component: Glass2,
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
        story: `기본 Glass2 효과를 보여주는 스토리입니다. 개선된 유리 재질의 투명도와 반사 효과를 확인할 수 있습니다.`,
      },
      source: {
        code: Glass2Code,
      },
    },
  },
};
