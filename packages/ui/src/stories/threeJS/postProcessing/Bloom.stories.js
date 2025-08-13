import Bloom from '../../../components/threeJS/postProcessing/Bloom';
import BloomCode from '../../../components/threeJS/postProcessing/Bloom?raw';

const description = `
Bloom Post-Processing Effect 입니다.

- intensity: 블룸 효과의 강도를 설정합니다.
- mipmapBlur: 블룸 효과의 미리보기 블러를 활성화합니다.
- luminanceThreshold: 블룸 효과의 밝기 임계값을 설정합니다.
- luminanceSmoothing: 블룸 효과의 밝기 스무딩을 설정합니다.
`;

export default {
    title: 'threeJS/PostProecessing/Bloom',
    component: Bloom,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: BloomCode,
            },
        },
    },
};

export const Default = {};
