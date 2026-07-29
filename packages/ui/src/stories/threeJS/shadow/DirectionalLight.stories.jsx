import DirectionalLight from '@workspace/ui/components/threeJS/shadow/DirectionalLight.jsx';
import DirectionalLightCode from '@workspace/ui/components/threeJS/shadow/DirectionalLight.jsx?raw';

const description = `
Three.js의 Shadow 컴포넌트입니다.
- castShadow: 그림자 생성
- receiveShadow: 그림자 수신

그림자가 잘리는 이유는 절두체를 벗어나기 때문이므로 절두체의 크기를 키워준다.

그림자의 품질을 위해서는 카메라의 절두체 크기를 최소로 만들어야 좋다.

그림자 이미지의 크기는 \`shawdowMap\` 사이즈로 지정할 수 있다. (기본 512px)
`;

export default {
    title: 'threeJS/Shadow/DirectionalLight',
    component: DirectionalLight,
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
                code: DirectionalLightCode,
            },
        },
    },
};
