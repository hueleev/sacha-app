import Light  from '../../components/threeJS/Light.jsx'
import LightCode from '../../components/threeJS/Light.jsx?raw'

const description = `
Light`

export default {
    title: 'threeJS/Light',
    component: Light,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: description,
            },
            source: {
                code: LightCode,
            },
        },
    },
    argTypes: {
        ambientLight: {
            control: 'boolean',
            description: 'Ambient Light를 켜고 끕니다',
            defaultValue: true
        },
        hemisphereLight: {
            control: 'boolean',
            description: 'Hemisphere Light를 켜고 끕니다',
            defaultValue: false
        },
        directionalLight: {
            control: 'boolean',
            description: 'Directional Light를 켜고 끕니다',
            defaultValue: false
        },
        pointLight: {
            control: 'boolean',
            description: 'Point Light를 켜고 끕니다',
            defaultValue: false
        }
    }
}

export const AmbientLight = {
    args: {
        ambientLight: true,
    }
}

export const HemisphereLight = {
    args: {
        ambientLight: false,
        hemisphereLight: true,
    }
}

export const DirectionalLight = {
    args: {
        ambientLight: false,
        directionalLight: true,
    }
}

export const PointLight = {
    args: {
        ambientLight: false,
        pointLight: true,
    }
}