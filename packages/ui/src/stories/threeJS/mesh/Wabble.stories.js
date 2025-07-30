import Wabble from "../../../components/threeJS/mesh/Wabble";
import WabbleCode from "../../../components/threeJS/mesh/Wabble.tsx?raw";

const description = `
흔들거리는 효과를 보여주는 컴포넌트입니다.

### 주요 기능
- **동적 움직임**: 물체가 자연스럽게 흔들리는 애니메이션
- **시간 기반 애니메이션**: 시간에 따라 변화하는 움직임 패턴
- **사용자 인터랙션**: 마우스나 터치에 반응하는 동적 효과

### 애니메이션 특징
- **부드러운 움직임**: 자연스러운 흔들림 효과
- **주기적 변화**: 일정한 주기로 반복되는 움직임
- **3D 공간 활용**: X, Y, Z 축을 모두 활용한 입체적 움직임

### 사용된 기술
- Three.js 애니메이션 시스템
- requestAnimationFrame을 활용한 부드러운 렌더링
- 수학적 함수를 통한 자연스러운 움직임 계산
`;

export default {
  title: "threeJS/mesh/Wabble",
  component: Wabble,
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
        story: `기본 Wabble 효과를 보여주는 스토리입니다. 물체의 자연스러운 흔들림 애니메이션을 확인할 수 있습니다.`,
      },
      source: {
        code: WabbleCode,
      },
    },
  },
};
