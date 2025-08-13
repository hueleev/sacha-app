import SoftShadows from '../../../../components/threeJS/shadow/drei/SoftShadows.jsx';
import SoftShadowsCode from '../../../../components/threeJS/shadow/drei/SoftShadows.jsx?raw';

const description = `
 \`directionalLight\`의 그림자를 가져다가 계산한 것이므로 \`directionalLight\` 가 꼭 필요함.
`;

export default {
    title: 'threeJS/Shadow/Drei/SoftShadows',
    component: SoftShadows,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: SoftShadowsCode,
            },
        },
    },
};

export const Default = {};
