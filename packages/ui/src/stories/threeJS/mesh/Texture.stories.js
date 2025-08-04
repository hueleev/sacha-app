import Texture from "../../../components/threeJS/mesh/Texture.js";
import Glass3Code from "../../../components/threeJS/mesh/Texture.tsx?raw";

const description = `
창문 모델을 활용한 창문 모델입니다.

https://3dtextures.me/2020/07/15/glass-window-002/

\`metalness * metalnessMap\` 이므로 metalness 값을 설정해줘야 map이 적용됩니다.
  
\`THREE.NoColorSpace\`는 텍스쳐의 색상 공간을 지정하는 상수

텍스처의 색상 변환을 비활성화하는데 사용함.

주로 거칠기, 금속성과 같이 색이 아닌 재질의 속성을 나타낼 때 사용함.

- metalic은 흰색은 금속, 검정은 비금속

- roughness는 흰색은 거침, 검정은 매끄러움 
`;

export default {
    title: "threeJS/mesh/Texture_Metal_Rough",
    component: Texture,
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
            source: {
                code: Glass3Code,
            },
        },
    },
};
