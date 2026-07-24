import Light from '../../components/threeJS/Light.jsx';
import LightCode from '../../components/threeJS/Light.jsx?raw';

const description = `
Three.js 조명 컴포넌트입니다.

이 컴포넌트는 다양한 Three.js 조명 유형을 시연합니다:

각 조명 유형은 컨트롤을 통해 개별적으로 켜고 끌 수 있습니다.
.`;

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
            defaultValue: true,
        },
        hemisphereLight: {
            control: 'boolean',
            description: 'Hemisphere Light를 켜고 끕니다',
            defaultValue: false,
        },
        directionalLight: {
            control: 'boolean',
            description: 'Directional Light를 켜고 끕니다',
            defaultValue: false,
        },
        pointLight: {
            control: 'boolean',
            description: 'Point Light를 켜고 끕니다',
            defaultValue: false,
        },
        spotLight: {
            control: 'boolean',
            description: 'Spot Light를 켜고 끕니다',
            defaultValue: false,
        },
        rectAreaLight: {
            control: 'boolean',
            description: 'RectAreaLight를 켜고 끕니다',
            defaultValue: false,
        },
        environmentLight: {
            control: 'boolean',
            description: 'Environment Light를 켜고 끕니다',
            defaultValue: false,
        },
    },
};

export const AmbientLight = {
    parameters: {
        docs: {
            description: {
                story: '장면 전체에 균일하게 적용되는 기본 조명입니다. 방향이 없으며 그림자를 생성하지 않습니다. 장면의 기본 밝기를 설정하는 데 유용합니다.',
            }
        }
    },
    args: {
        ambientLight: true,
    },
};

export const HemisphereLight = {
    parameters: {
        docs: {
            description: {
                story: '하늘색과 지면색 사이의 그라데이션을 생성하는 조명입니다. 야외 장면에 자연스러운 조명을 제공하는 데 이상적입니다.'
            }
        }
    },
    args: {
        ambientLight: false,
        hemisphereLight: true,
    },
};

export const DirectionalLight = {
    parameters: {
        docs: {
            description: {
                story: '태양과 같이 멀리 있는 광원을 시뮬레이션합니다. 모든 광선이 평행하게 이동하며, 그림자를 생성할 수 있습니다. 장면에서 작은 빨간 구체가 회전하면 조명이 이를 따라갑니다.'
            }
        }
    },
    args: {
        ambientLight: false,
        directionalLight: true,
    },
};

export const PointLight = {
    parameters: {
        docs: {
            description: {
                story: '전구와 같이 한 지점에서 모든 방향으로 빛을 방출합니다. 거리에 따라 빛의 강도가 감소합니다. 장면에서 작은 빨간 구체가 회전하면 조명이 이를 따라갑니다.'
            }
        }
    },
    args: {
        ambientLight: false,
        pointLight: true,
    },
};

export const SpotLight = {
    parameters: {
        docs: {
            description: {
                story: '원뿔 모양으로 빛을 방출하는 광원으로, 특정 영역을 집중적으로 비춥니다. 위치, 방향, 각도, 그리고 페넘브라를 조절할 수 있습니다.'
            }
        }
    },
    args: {
        ambientLight: false,
        spotLight: true,
    },
};

export const RectAreaLight = {
    parameters: {
        docs: {
            description: {
                story: '사각형 모양의 면에서 빛을 방출하는 광원으로, 형광등이나 창문에서 들어오는 빛과 유사합니다. RectAreaLight는 일반적인 광원과 달리 물리 기반 렌더링(PBR, Physically Based Rendering) 기법을 사용하여 빛을 계산합니다. 이 계산을 위해서는 특별한 셰이더 코드가 필요하며, \`RectAreaLightUniformsLib.init()\`가 바로 이 코드를 준비하는 역할을 합니다.'
            }
        }
    },
    args: {
        ambientLight: false,
        rectAreaLight: true,
    },
};

export const EnvironmentLight = {
    parameters: {
        docs: {
            description: {
                story: 'HDR 이미지를 사용하여 장면에 환경 조명과 배경을 제공합니다. Drei 라이브러리와 https://polyhaven.com/ 사용.'
            }
        }
    },
    args: {
        ambientLight: false,
        environmentLight: true,
    },
};
