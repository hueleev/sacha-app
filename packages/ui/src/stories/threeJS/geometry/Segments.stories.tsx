import Segments from "../../../components/threeJS/geometry/Segments";
import SegmentsCode from "../../../components/threeJS/geometry/Segments.tsx?raw";

export default {
  title: "threeJS/geometry/Segments",
  component: Segments,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Segments입니다.
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
        code: SegmentsCode,
      },
    },
  },
};
