import HueSaturationBrightnessContrast from '../../../components/threeJS/postProcessing/HueSaturationBrightnessContrast';
import HueSaturationBrightnessContrastCode from '../../../components/threeJS/postProcessing/HueSaturationBrightnessContrast?raw';

const description = `
HueSaturation, BrightnessContrast 등의 후처리 효과를 적용하는 HueSaturationBrightnessContrast 컴포넌트입니다.
`;

export default {
    title: 'threeJS/PostProecessing/HueSaturation,BrightnessContrast',
    component: HueSaturationBrightnessContrast,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: HueSaturationBrightnessContrastCode,
            },
        },
    },
};

export const Default = {};
