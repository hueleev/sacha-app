import Orthographic from '../../../components/threeJS/camera/Orthographic.jsx';
import OrthographicCode from '../../../components/threeJS/camera/Orthographic.jsx?raw';

const description = `
Three.js의 카메라 컴포넌트입니다.

- PerspectiveCamera: 3D 환경을 3D 공간으로 보는 카메라

- OrthographicCamera: 3D 환경을 2D 공간으로 보는 카메라

- CubeCamera: 환경 맵을 생성하는 카메라

\`aspect = width/height\`

---

- left : 좌측 좌표
- right : 우측 좌표
- top : 상단 좌표
- bottom : 하단 좌표
- near : 카메라 가까운 거리
- far : 카메라 먼 거리
`;

export default {
    title: 'threeJS/Camera/Orthographic',
    component: Orthographic,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: OrthographicCode,
            },
        },
    },
    argTypes: {
        zoom: {
            control: {
                type: 'range',
                min: 1,
                max: 100,
                step: 1,
            },
        },
        near: {
            control: {
                type: 'range',
                min: 0.1,
                max: 100,
                step: 0.1,
            },
        },
        far: {
            control: {
                type: 'range',
                min: 0.1,
                max: 1000,
                step: 0.1,
            },
        },
    },
};

export const Default = {
    args: {
        zoom: 100,
        near: 0.1,
        far: 20,
    },
};
