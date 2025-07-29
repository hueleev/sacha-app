import Toon from "../../../components/threeJS/mesh/Toon";
import ToonCode from "../../../components/threeJS/mesh/Toon.tsx?raw";

export default {
  title: "threeJS/mesh/Toon",
  component: Toon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
만화 효과를 내는 mesh입니다.

[https://sbcode.net/threejs/meshtoonmaterial/](https://sbcode.net/threejs/meshtoonmaterial/)
에서 제공하는 gradients를 활용합니다.
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
        code: ToonCode,
      },
    },
  },
};
