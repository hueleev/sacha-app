# React + Vite

-   시계 반대 방향이 + 방향

-   Canvas = Renderer + Scene + Camera

-   도 => 라디안: 1도 = (Math.PI / 180) 라디안

-   3D 객체: mesh
    Position
    Rotation
    Scale

-   delta (델타 타임)는 이전 프레임이 렌더링된 시점부터 현재 프레임이 렌더링될 때까지 걸린 시간을 알려줍니다.
-   프레임: 움직이는 영상, 애니메이션, 게임 등에서 특정 순간의 장면을 담고 있는 한 장의 정지 이미지.
    Three.js에서는 브라우저가 화면을 한 번 업데이트할 때마다 계산하고 그리는 결과물이 하나의 프레임이며, 이 프레임 간의 시간 간격(delta)을 활용하여 부드럽고 일정한 속도의 애니메이션을 구현합니다.
-   만약 애니메이션 속도를 단순히 object.position.x += 0.01과 같이 고정된 값으로 설정하면, 프레임 속도가 빠른 기기에서는 오브젝트가 더 빠르게 움직이고, 프레임 속도가 느린 기기에서는 더 느리게 움직이는 문제가 발생합니다.

-   Drei: R3F에서 사용할 수 있는 유용한 컴포넌트들을 모아놓은 라이브러리

-   Box 3개

```jsx
import { Box, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function MyBox(props) {
    const geom = new THREE.BoxGeometry();
    return <mesh {...props} geometry={geom} />;
}

function MyElement3D() {
    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.1} />
            <directionalLight position={[2, 1, 3]} intensity={0.5} />
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color="#1abc9c" />
            </mesh>

            <Box position={[1.2, 0, 0]}>
                <meshStandardMaterial color="#8e44ad" />
            </Box>

            <MyBox position={[-1.2, 0, 0]}>
                <meshStandardMaterial color="#e74c3c" />
            </MyBox>
        </>
    );
}
```

-   segments

```jsx
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function MyElement3D() {
    const refMesh = useRef();
    const refWireMesh = useRef();

    const { xSize, ySize, zSize, xSegments, ySegments, zSegments } = useControls({
        xSize: { value: 1, min: 0.1, max: 5, step: 0.01 },
        ySize: { value: 1, min: 0.1, max: 5, step: 0.01 },
        zSize: { value: 1, min: 0.1, max: 5, step: 0.01 },
        xSegments: { value: 1, min: 1, max: 10, step: 1 },
        ySegments: { value: 1, min: 1, max: 10, step: 1 },
        zSegments: { value: 1, min: 1, max: 10, step: 1 },
    });

    useEffect(() => {
        refWireMesh.current.geometry = refMesh.current.geometry;
    }, [xSize, ySize, zSize, xSegments, ySegments, zSegments]);

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.1} />
            <directionalLight position={[2, 1, 3]} intensity={0.5} />
            <mesh ref={refMesh}>
                <boxGeometry args={[xSize, ySize, zSize, xSegments, ySegments, zSegments]} />
                <meshStandardMaterial color="#1abc9c" />
            </mesh>

            <mesh ref={refWireMesh}>
                <meshStandardMaterial emissive="yellow" wireframe={true} />
            </mesh>
        </>
    );
}

export default MyElement3D;
```

-   Camera의 near와 far 속성

    1. Near (근평면)
       카메라에서 가장 가까운 렌더링 거리
       이 거리보다 가까운 객체는 렌더링되지 않음
       현재 설정: near: 3.5 → 카메라로부터 3.5 단위 이내의 객체는 보이지 않음

    2. Far (원평면)
       카메라에서 가장 먼 렌더링 거리
       이 거리보다 먼 객체는 렌더링되지 않음
       현재 설정: far: 6 → 카메라로부터 6 단위 이상 떨어진 객체는 보이지 않음

-   mesh
    https://github.com/emmelleppi/matcaps

-   drei
    https://drei.docs.pmnd.rs/
    https://drei.pmnd.rs/

