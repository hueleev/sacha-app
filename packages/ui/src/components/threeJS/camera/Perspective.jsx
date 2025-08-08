import React from 'react';
import { Canvas } from '@react-three/fiber';

import Main from '../Main.js';
import { HemisphereLight } from '../../../stories/threeJS/Light.stories.js';

function Perspective() {
    return (
        <Main>
            <Canvas camera={{ fov: 75, position: [7, 7, 0] }}>
                <HemisphereLight />
            </Canvas>
        </Main>
    );
}

export default Perspective;
