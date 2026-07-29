import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            '@workspace/ui': path.resolve(__dirname, './src'),
        },
    },
    assetsInclude: ['**/*.hdr', '**/*.glb'], // 이 줄을 추가하거나 수정합니다.
});
