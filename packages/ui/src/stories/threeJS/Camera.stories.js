import Perspective from '../../components/threeJS/camera/Perspective.jsx';
import PerspectiveCode from '../../components/threeJS/camera/Perspective.jsx?raw';

const description = `
Three.js의 카메라 컴포넌트입니다.

- PerspectiveCamera: 3D 환경을 3D 공간으로 보는 카메라

- OrthographicCamera: 3D 환경을 2D 공간으로 보는 카메라

- CubeCamera: 환경 맵을 생성하는 카메라

\`aspect = width/height\`
`;
const perspectiveDescription = `
- fov : 카메라 화각
- near : 카메라 가까운 거리
- far : 카메라 먼 거리

\`position\`은 **"카메라가 어디에 있는지"**를 결정하고, \`lookAt\`은 **"카메라가 어디를 바라보고 있는지"**를 결정합니다.
`;
export default {
    title: 'threeJS/Camera',
    component: Perspective,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
                story: perspectiveDescription,
            },
            source: {
                code: PerspectiveCode,
            },
        },
    },
    argTypes: {
        fov: {
            control: {
                type: 'range',
                min: 1,
                max: 180,
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
        isSphere: {
            control: {
                type: 'boolean',
            },
        },
    },
};

export const PerspectiveCamera = {
    parameter: {
        docs: {
            description: {
                story: perspectiveDescription,
            },
        },
    },
    args: {
        fov: 75,
        near: 0.1,
        far: 20,
    },
};

export const PerspectiveCamera2 = {
    parameter: {
        docs: {
            title: 'PerspectiveCamera',
            description: {
                story: perspectiveDescription,
            },
        },
    },

    args: {
        fov: 75,
        near: 0.1,
        far: 20,
    },
};
