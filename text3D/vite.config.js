const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env
import { defineConfig } from 'vite';

export default {
    root: 'src/',
    publicDir: '../static/',
    base: '/threeD_projs/text3D/',
    server:
    {
        host: true,
        open: !isCodeSandbox // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist/text3D/',
        emptyOutDir: true,
        sourcemap: true
    }
}
