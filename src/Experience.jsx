import { useFrame, extend } from '@react-three/fiber'
import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import TerrainShader from './Shaders/TerrainShader'

const Terrain = shaderMaterial(
    { uTime: 0, uColor: new THREE.Color(0.0, 0.5, 1.0) },
    // Vertex Shader
    /*glsl*/
    `
        varying vec2 vUv;
        void main()
        {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
     // fragment shader
    /*glsl*/
    `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() 
        {
            gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + uTime) + uColor, 1.0);
        }
    `
)
extend({ Terrain })

export default function Experience()
{

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <TerrainShader />

    </>
}