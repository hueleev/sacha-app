import type { StoryObj } from '@storybook/react';
import SampleMain from '../components/threeJS/SampleMain';

const description = `
# 🎨 스토리북 학습 노트

안녕하세요! 👋 이 스토리북은 React Three Fiber(R3F)를 공부하면서 만든 학습 노트입니다. 🚀

## 📚 목차

### 1. 🔷 Geometry 컴포넌트들
- [Box](./?path=/docs/threejs-geometry-box--docs) - 박스 형태 📦
- [Segments](./?path=/docs/threejs-geometry-segments--docs) - 세그먼트 형태 📐
- [ThreeBox](./?path=/docs/threejs-geometry-threebox--docs) - 3D 박스 형태 📦

### 2. 🎭 Mesh 컴포넌트들
- [Refraction](./?path=/docs/threejs-mesh-refraction--docs) - 굴절 효과 🔮
- [Shader](./?path=/docs/threejs-mesh-shader--docs) - 셰이더 재질 🎨
- [MatCap](./?path=/docs/threejs-mesh-matcap--docs) - MatCap 재질 🎭
- [Glass](./?path=/docs/threejs-mesh-glass--docs) - 유리 재질 🪟
- [Glass2](./?path=/docs/threejs-mesh-glass2--docs) - 유리 재질 2 🪟
- [Wabble](./?path=/docs/threejs-mesh-wabble--docs) - 움직임 효과 🌊
- [Reflector](./?path=/docs/threejs-mesh-reflector--docs) - 반사 효과 💎
- [Toon](./?path=/docs/threejs-mesh-toon--docs) - 툰 셰이딩 🎪

## 🎯 학습 목표
- React Three Fiber의 기본 개념 이해 🧠
- 다양한 재질과 효과 학습 🎨
- 3D 인터랙션 구현 방법 습득 🎮
- 성능 최적화 기법 학습 ⚡

## 📖 참고 자료
- [PMND 공식 문서](https://docs.pmnd.rs/) 📚
- [Three.js 공식 문서](https://threejs.org/docs/) 📖
- [Drei 라이브러리](https://github.com/pmndrs/drei) 🛠️
- [GIS DEVELOPER youtube](https://youtu.be/Sg6OcVxe64k?si=Z0oJRdiYVYkvNnvQ) 🎞️

`;
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Introduction',
    component: SampleMain,
    tags: ['autodocs'],
    argTypes: {
        color: { control: 'color' },
    },
    parameters: {
        docs: {
            description: {
                component: description,
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {
        color: 'red',
    },
};
