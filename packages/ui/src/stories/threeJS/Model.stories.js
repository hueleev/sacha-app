import Model from '../../components/threeJS/Model.jsx';
import ModelCode from '../../components/threeJS/Model.jsx?raw';

const description = `
3D 모델을 렌더링하는 컴포넌트입니다.

mixamo의 모델을 사용합니다.
`;

export default {
    title: 'threeJS/Model',
    component: Model,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: ModelCode,
            },
        },
    },
};

export const Default = {};
