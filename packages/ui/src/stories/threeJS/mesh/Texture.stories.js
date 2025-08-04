import Texture from "../../../components/threeJS/mesh/Texture.js";
import Glass3Code from "../../../components/threeJS/mesh/Texture.tsx?raw";

const description = `
창문 모델을 활용한 창문 모델입니다.

https://3dtextures.me/2020/07/15/glass-window-002/

각 맵의 특성:
- Base Map: 기본 색상 텍스처
- Metallic Map: 흰색은 금속, 검정은 비금속 (\`metalness * metalnessMap\`)
- Roughness Map: 흰색은 거침, 검정은 매끄러움
- Normal Map: 표면의 굴곡을 나타내는 정규화된 텍스처
- Displacement Map: 실제 지오메트리를 변형시켜 입체감을 만듦 (밝을수록 더 돌출)
- Ambience Map: 환경의 밝기를 나타내는 텍스처
- Alpha Map: 투명도 텍스처 

- wrapS: 텍스처가 가로로 확장되는 방향
- wrapT: 텍스처가 세로로 확장되는 방향

\`THREE.NoColorSpace\`는 텍스처의 색상 공간을 지정하는 상수로,
색상이 아닌 재질의 속성(거칠기, 금속성 등)을 나타내는 맵에 사용됩니다.
`;


export default {
    title: "threeJS/mesh/Texture",
    component: Texture,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: description,
            },
        },
    },
    argTypes: {
        useBaseMap: {
            control: 'boolean',
            description: '기본 색상 맵 사용 여부',
            defaultValue: true
        },
        useRoughnessMap: {
            control: 'boolean',
            description: '거칠기 맵 사용 여부',
            defaultValue: true
        },
        useMetallicMap: {
            control: 'boolean',
            description: '금속성 맵 사용 여부',
            defaultValue: true
        },
        useNormalMap: {
            control: 'boolean',
            description: '노멀 맵 사용 여부',
            defaultValue: true
        },
        useDisplacementMap: {
            control: 'boolean',
            description: '변위 맵 사용 여부',
            defaultValue: true
        },
        useAmbientMap: {
            control: 'boolean',
            description: '환경 맵 사용 여부',
            defaultValue: true
        },
        useAlphaMap: {
            control: 'boolean',
            description: '투명도 맵 사용 여부',
            defaultValue: true
        },
        metalness: {
            control: {type: 'range', min: 0, max: 1, step: 0.1},
            description: '금속성 정도',
            defaultValue: 0.5
        },
        roughness: {
            control: {type: 'range', min: 0, max: 1, step: 0.1},
            description: '거칠기 정도',
            defaultValue: 1
        },
        normalScale: {
            control: {type: 'range', min: 0, max: 3, step: 0.1},
            description: '노멀 맵 강도',
            defaultValue: 1
        },
        displacementScale: {
            control: {type: 'range', min: -1, max: 1, step: 0.1},
            description: '변위 맵 스케일',
            defaultValue: 0.2
        },
        displacementBias: {
            control: {type: 'range', min: -1, max: 1, step: 0.1},
            description: '변위 맵 바이어스',
            defaultValue: -0.2
        }
    }
};

export const Default = {
    args: {
        useBaseMap: true,
        useRoughnessMap: true,
        useMetallicMap: true,
        useNormalMap: true,
        useDisplacementMap: true,
        useAmbientMap: true,
        useAlphaMap: false,
        metalness: 0.5,
        roughness: 1,
        normalScale: 1,
        displacementScale: 0.2,
        displacementBias: -0.2
    },
    parameters: {
        docs: {
            source: {
                code: Glass3Code,
            },
        },
    },
};
