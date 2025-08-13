import React, { useEffect, useState } from 'react';

import { Canvas } from '@react-three/fiber';
import Main from './Main';

import { Environment, OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import modelUrl from '../../../public/assets/threeJS/model.glb';

function MyElement3D() {
    const model = useGLTF(modelUrl);
    const animations = useAnimations(model.animations, model.scene);
    const { actionName } = useControls({
        actionName: {
            value: animations.names[0],
            options: animations.names,
        },
    });

    useEffect(() => {
        const action = animations.actions[actionName];
        action.reset().fadeIn(0.5).play();
        return () => {
            action.fadeOut(0.5);
        };
    }, [actionName]);

    // 높이 조절
    const [height, setHeight] = useState(0);
    useEffect(() => {
        let minY = Infinity,
            maxY = -Infinity;
        model.scene.traverse((item) => {
            if (item.isMesh) {
                const geomBbox = item.geometry.boundingBox;
                if (minY > geomBbox.min.y) {
                    minY = geomBbox.min.y;
                }
                if (maxY < geomBbox.max.y) {
                    maxY = geomBbox.max.y;
                }
            }
        });

        setHeight(maxY - minY);
    }, [model.scene]);

    return (
        <>
            <OrbitControls />
            {/* files={envFile} */}
            <Environment blur={0} preset="sunset" />
            <primitive object={model.scene} scale={3} position-y={-(height / 2) * 3} />
        </>
    );
}

function Model() {
    return (
        <Main>
            <Canvas>
                <MyElement3D />
            </Canvas>
        </Main>
    );
}

export default Model;
