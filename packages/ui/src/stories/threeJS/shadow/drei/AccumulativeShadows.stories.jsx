import AccumulativeShadows from '../../../../components/threeJS/shadow/drei/AccumulativeShadows.jsx';
import AccumulativeShadowsCode from '../../../../components/threeJS/shadow/drei/AccumulativeShadows.jsx?raw';

const description = `
- 정적인 그림자 (동적도 되지만 정적으로 주로 사용)
- mesh가 움직여도 그림자는 변경되지 않는다.
- 그림자를 표시할 바닥이 저절로 표현되므로 평면 mesh가 따로 필요하지 않음.
- 다른 mesh에는 표현되지 않으므로 \`receiveShadow\`가 작동하지 않음.

---

- position: 그림자가 표현되는 위치
- scale: 그림자의 크기
- color: 그림자의 색상
- opacity: 그림자의 불투명도
- frames: 그림자가 표현되는 프레임 수 (Infinity: 동적)
`;

export default {
    title: 'threeJS/Shadow/Drei/AccumulativeShadows',
    component: AccumulativeShadows,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: AccumulativeShadowsCode,
            },
        },
    },
};

export const Default = {};
