import Toon from "../../../components/threeJS/mesh/Toon";
import ToonCode from "../../../components/threeJS/mesh/Toon.tsx?raw";

const description = `
만화 효과를 내는 mesh입니다.

### 주요 기능
- **셀 셰이딩**: 만화나 애니메이션 스타일의 평면적 색상 표현
- **단계적 명암**: 부드러운 그라데이션 대신 명확한 단계적 명암
- **아트 스타일**: 게임이나 애니메이션에서 사용되는 특유의 시각적 스타일

### 셀 셰이딩 특징
- **단계적 색상**: 연속적인 색상 변화 대신 명확한 단계
- **강한 대비**: 밝은 부분과 어두운 부분의 뚜렷한 구분
- **스타일화된 렌더링**: 사실적 렌더링 대신 예술적 표현

### 사용된 기술
- Three.js MeshToonMaterial
- 그라데이션 텍스처를 활용한 단계적 명암
- 커스텀 셰이더 시스템

### 참고 자료
https://sbcode.net/threejs/meshtoonmaterial/

에서 제공하는 gradients를 활용합니다.
`;

export default {
  title: "threeJS/mesh/Toon",
  component: Toon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: `기본 Toon 효과를 보여주는 스토리입니다. 만화 스타일의 셀 셰이딩 효과를 확인할 수 있습니다.`,
      },
      source: {
        code: ToonCode,
      },
    },
  },
};
