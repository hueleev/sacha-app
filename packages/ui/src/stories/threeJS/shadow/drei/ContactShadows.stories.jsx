import ContactShadows from '../../../../components/threeJS/shadow/drei/ContactShadows.jsx';
import ContactShadowsCode from '../../../../components/threeJS/shadow/drei/ContactShadows.jsx?raw';

const description = `
R3F의 기본적인 그림자 기능을 전혀 사용하지 않는 독립적인 그림자 컴포넌트

- 평면을 제공해준다.
- 평면에만 그림자를 드리운다.

---

- position: 평면의 위치를 지정한다.
- scale: 평면의 크기를 지정한다.
- resolution: 그림자의 해상도를 지정한다.
- color: 그림자의 색상을 지정한다.
- opcacity: 그림자의 불투명도를 지정한다.
- blur: 그림자의 흐림 정도를 지정한다.
- frames: 그림자를 계산하는 프레임 수를 지정한다. (1로 설정 시, 정적)
                
`;

export default {
    title: 'threeJS/Shadow/Drei/ContactShadows',
    component: ContactShadows,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: ContactShadowsCode,
            },
        },
    },
};

export const Default = {};
