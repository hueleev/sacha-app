import Glass from "../../../components/threeJS/mesh/Glass";
import GlassCode from "../../../components/threeJS/mesh/Glass.tsx?raw";

export default {
  title: "threeJS/mesh/Glass",
  component: Glass,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
glass 효과를 보여주는 컴포넌트입니다.

### camera 속성

- \`Near\` (근평면):
    카메라에서 가장 가까운 렌더링 거리
    이 거리보다 가까운 객체는 렌더링되지 않음
    현재 설정: near: 3.5 → 카메라로부터 3.5 단위 이내의 객체는 보이지 않음

- \`Far\` (원평면):
    카메라에서 가장 먼 렌더링 거리
    이 거리보다 먼 객체는 렌더링되지 않음
    현재 설정: far: 6 → 카메라로부터 6 단위 이상 떨어진 객체는 보이지 않음
        `,
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
      source: {
        code: GlassCode,
      },
    },
  },
};
