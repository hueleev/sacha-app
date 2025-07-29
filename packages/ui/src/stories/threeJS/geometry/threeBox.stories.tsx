import ThreeBox from "../../../components/threeJS/geometry/ThreeBox";
import ThreeBoxCode from "../../../components/threeJS/geometry/ThreeBox.tsx?raw";

export default {
  title: "threeJS/geometry/ThreeBox",
  component: ThreeBox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
box를 그리는 3가지 방법입니다.
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
        code: ThreeBoxCode,
      },
    },
  },
};
