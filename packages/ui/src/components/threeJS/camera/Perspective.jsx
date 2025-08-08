import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';

import Main from '../Main.js';
import { MeshObject, RectAreaLight } from '../Light.jsx';

function Perspective() {
    const light = useRef();
    return (
        <div style={{ backgroundColor: 'black' }}>
            <Main>
                <Canvas camera={{ fov: 75, position: [7, 7, 0] }}>
                    <MeshObject light={light} />
                    <RectAreaLight light={light} />
                </Canvas>
            </Main>
        </div>
    );
}

export default Perspective;
