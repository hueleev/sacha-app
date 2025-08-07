import Perspective from '../../components/threeJS/camera/Perspective.jsx';
import PerspectiveCode from '../../components/threeJS/camera/Perspective.jsx?raw';

const description = `
Three.js의 카메라 컴포넌트입니다.

- PerspectiveCamera: 3D 환경을 3D 공간으로 보는 카메라

- OrthographicCamera: 3D 환경을 2D 공간으로 보는 카메라

- CubeCamera: 환경 맵을 생성하는 카메라


\`aspect = width/height\`

`;

export default {
    title: 'threeJS/Camera',
    component: Perspective,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: PerspectiveCode,
            },
        },
    },
};

export const Default = {
    parameters: {
        docs: {
            description: {},
            source: {
                code: PerspectiveCode,
            },
        },
    },
};
