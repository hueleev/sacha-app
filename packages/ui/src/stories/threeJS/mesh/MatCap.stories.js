import MatCap from "../../../components/threeJS/mesh/MatCap";
import MatCapCode from "../../../components/threeJS/mesh/MatCap.tsx?raw";

export default {
  title: "threeJS/mesh/MatCap",
  component: MatCap,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
matcap을 활용한 mesh 입니다.        
[https://github.com/emmelleppi/matcaps](  https://github.com/emmelleppi/matcaps)

        `,
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
        story: ``,
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
