import Shader from "../../../components/threeJS/mesh/Shader";
import ShaderCode from "../../../components/threeJS/mesh/Shader.tsx?raw";

const description = `
커스텀 셰이더를 활용한 mesh 컴포넌트입니다.

### 주요 기능
- **커스텀 셰이더**: GLSL을 활용한 사용자 정의 렌더링
- **동적 효과**: 시간에 따라 변화하는 시각적 효과
- **고성능 렌더링**: GPU 가속을 활용한 효율적인 렌더링

### 셰이더 시스템
- **버텍스 셰이더**: 3D 공간에서의 위치 계산 및 변환
- **프래그먼트 셰이더**: 픽셀별 색상 및 효과 계산
- **유니폼 변수**: CPU에서 GPU로 전달되는 동적 데이터

### 셰이더 특징
- **시간 기반 애니메이션**: 시간 유니폼을 활용한 동적 효과
- **UV 좌표 활용**: 텍스처 매핑과 유사한 좌표 시스템
- **수학적 함수**: sin, cos 등 수학 함수를 활용한 패턴 생성

### 사용된 기술
- Three.js ShaderMaterial
- GLSL (OpenGL Shading Language)
- WebGL 기반 렌더링
- 유니폼 변수 시스템

### 개발 팁
- 셰이더 코드는 문자열로 작성
- 유니폼 변수는 CPU에서 GPU로 전달
- varying 변수는 버텍스에서 프래그먼트로 전달
`;

export default {
  title: "threeJS/mesh/Shader",
  component: Shader,
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
        story: `기본 Shader 효과를 보여주는 스토리입니다. 커스텀 셰이더를 활용한 동적 색상 변화 효과를 확인할 수 있습니다.`,
      },
      source: {
        code: ShaderCode,
      },
    },
  },
};
