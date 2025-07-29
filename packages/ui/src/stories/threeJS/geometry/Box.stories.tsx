import Box from "../../../components/threeJS/geometry/Box";
import BoxCode from "../../../components/threeJS/geometry/Box.tsx?raw";

export default {
  title: "threeJS/geometry/Box",
  component: Box,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
기본 geometry 입니다.

### 주요 사항
- 시계 반대 방향이 + 방향
- Canvas = Renderer + Scene + Camera
- 도 => 라디안: 1도 = (Math.PI / 180) 라디안
- 3D 객체:
    - mesh
    - Position
    - Rotation
    - Scale
- \`delta (델타 타임)\`는 이전 프레임이 렌더링된 시점부터 현재 프레임이 렌더링될 때까지 걸린 시간을 알려줍니다.
- \`Frame\`: 움직이는 영상, 애니메이션, 게임 등에서 특정 순간의 장면을 담고 있는 한 장의 정지 이미지.
    Three.js에서는 브라우저가 화면을 한 번 업데이트할 때마다 계산하고 그리는 결과물이 하나의 프레임이며, 이 프레임 간의 시간 간격(delta)을 활용하여 부드럽고 일정한 속도의 애니메이션을 구현합니다.
- 만약 애니메이션 속도를 단순히 object.position.x += 0.01과 같이 고정된 값으로 설정하면, 프레임 속도가 빠른 기기에서는 오브젝트가 더 빠르게 움직이고, 프레임 속도가 느린 기기에서는 더 느리게 움직이는 문제가 발생합니다.
- \`Drei\`: R3F에서 사용할 수 있는 유용한 컴포넌트들을 모아놓은 라이브러리
 `,
      },
    },
  },
  argTypes: {
    // 컴포넌트의 props가 있다면 여기에 정의
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
      source: {
        code: BoxCode,
      },
    },
  },
};
