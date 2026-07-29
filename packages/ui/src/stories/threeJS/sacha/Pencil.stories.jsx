import Pencil from '@workspace/ui/components/threeJS/sacha/Pencil';
import PencilCode from '@workspace/ui/components/threeJS/sacha/Pencil?raw';

export default {
    title: 'threeJS/Sacha/Pencil',
    component: Pencil,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: '3D Pencil Model Example',
            },
            source: {
                code: PencilCode,
            },
        },
    },
};

export const Default = {};
