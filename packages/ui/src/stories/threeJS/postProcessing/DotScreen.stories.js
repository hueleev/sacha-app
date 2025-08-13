import DotScreen from '../../../components/threeJS/postProcessing/DotScreen';
import DotScreenCode from '../../../components/threeJS/postProcessing/DotScreen?raw';

const description = `
DotScreen Post-Processing Effect
`;

export default {
    title: 'threeJS/PostProecessing/DotScreen',
    component: DotScreen,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: DotScreenCode,
            },
        },
    },
};

export const Default = {};
