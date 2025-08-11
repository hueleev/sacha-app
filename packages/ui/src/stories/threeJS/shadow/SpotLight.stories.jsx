import SpotLight from '../../../components/threeJS/shadow/SpotLight.jsx';
import SpotLightCode from '../../../components/threeJS/shadow/SpotLight.jsx?raw';

const description = `
Three.js의 Shadow 컴포넌트입니다.
- castShadow: 그림자 생성
- receiveShadow: 그림자 수신

그림자가 잘리는 이유는 절두체를 벗어나기 때문이므로 절두체의 크기를 키워준다.

그림자의 품질을 위해서는 카메라의 절두체 크기를 최소로 만들어야 좋다.

---

**[\`shadows="variance"\`을 사용하면 그림자 품질을 조절할 수 있다.]**

- shadow-mapSize: 그림자 이미지의 크기를 조절할 수 있다. (기본 512px)
- shadow-radius: 그림자의 반지름을 조절할 수 있다. (기본 10px)
- shadow-blurSamples: 그림자의 흐림 효과를 조절할 수 있다. (기본 16)
- shadow-bias: 그림자의 흐림 효과를 조절할 수 있다. (기본 0.005)
`;

export default {
    title: 'threeJS/Shadow/SpotLight',
    component: SpotLight,
    tags: ['autodocs'],
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
                code: SpotLightCode,
            },
        },
    },
};
