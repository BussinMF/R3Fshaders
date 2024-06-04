import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useControls } from 'leva'
import { useRef } from 'react'
import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'

const TerrainShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uPositionFrequency: 0.2,
    uStrength: 2.0,
    uWarpFrequency: 5,
    uWarpStrength: 0.5,
    uColorWaterDeep: new THREE.Color('#002b3d'),
    uColorWaterSurface: new THREE.Color('#66a8ff'),
    uColorSand: new THREE.Color('#ffe894'),
    uColorGrass: new THREE.Color('#85d534'),
    uColorSnow: new THREE.Color('#ffffff'),
    uColorRock: new THREE.Color('#bfbd8d')
  },
  vertexShader,
  fragmentShader
)

const TerrainDepthMaterial = shaderMaterial(
  {
    uTime: 0,
    uPositionFrequency: 0.2,
    uStrength: 2.0,
    uWarpFrequency: 5,
    uWarpStrength: 0.5
  },
  vertexShader
)

extend({ TerrainShaderMaterial, TerrainDepthMaterial })

export default function TerrainShader() {
  const materialRef = useRef()
  const depthMaterialRef = useRef()

  const { uPositionFrequency, uStrength, uWarpFrequency, uWarpStrength, uColorWaterDeep, uColorWaterSurface, uColorSand, uColorGrass, uColorSnow, uColorRock } = useControls({
    uPositionFrequency: { value: 0.2, min: 0, max: 1, step: 0.001 },
    uStrength: { value: 2.0, min: 0, max: 10, step: 0.001 },
    uWarpFrequency: { value: 5, min: 0, max: 10, step: 0.001 },
    uWarpStrength: { value: 0.5, min: 0, max: 1, step: 0.001 },
    uColorWaterDeep: '#002b3d',
    uColorWaterSurface: '#66a8ff',
    uColorSand: '#ffe894',
    uColorGrass: '#85d534',
    uColorSnow: '#ffffff',
    uColorRock: '#bfbd8d'
  })

  useFrame((state, delta) => {
    if (materialRef.current && depthMaterialRef.current) {

      const material = materialRef.current
      const depthMaterial = depthMaterialRef.current

      material.uTime += delta
      depthMaterial.uTime += delta

      material.uPositionFrequency = uPositionFrequency
      material.uStrength = uStrength
      material.uWarpFrequency = uWarpFrequency
      material.uWarpStrength = uWarpStrength
      material.uColorWaterDeep = new THREE.Color(uColorWaterDeep)
      material.uColorWaterSurface = new THREE.Color(uColorWaterSurface)
      material.uColorSand = new THREE.Color(uColorSand)
      material.uColorGrass = new THREE.Color(uColorGrass)
      material.uColorSnow = new THREE.Color(uColorSnow)
      material.uColorRock = new THREE.Color(uColorRock)

      // Depth material updates
      depthMaterial.uPositionFrequency = uPositionFrequency
      depthMaterial.uStrength = uStrength
      depthMaterial.uWarpFrequency = uWarpFrequency
      depthMaterial.uWarpStrength = uWarpStrength
    }
  })

  return (
    <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
      <planeGeometry args={[10, 10, 500, 500]} />
      <terrainShaderMaterial ref={materialRef} />
      <meshDepthMaterial ref={depthMaterialRef} depthPacking={THREE.RGBADepthPacking} />
    </mesh>
  )
}
