uniform float uTime;
uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;

varying vec3 vPosition;
varying float vUpDot;
varying vec3 vNormal;

#include "../Shaders/includes/simplexNoise2d.glsl"

float getElevation(vec2 position) {
    vec2 warpedPosition = position;
    warpedPosition += uTime * 0.2;
    warpedPosition += simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency) * uWarpStrength;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;

    float elevationSign = sign(elevation);
    elevation = pow(abs(elevation), 2.0) * elevationSign;
    elevation *= uStrength;

    return elevation;
}

void main() {
    // Neighbours positions
    float shift = 0.01;
    vec3 positionA = position.xyz + vec3(shift, 0.0, 0.0);
    vec3 positionB = position.xyz + vec3(0.0, 0.0, -shift);

    // Elevation
    float elevation = getElevation(gl_Position.xz);
    gl_Position.y += elevation;
    positionA.y += getElevation(positionA.xz);
    positionB.y += getElevation(positionB.xz);

    // Compute normal
    vec3 toA = normalize(positionA - gl_Position.xyz);
    vec3 toB = normalize(positionB - gl_Position.xyz);
    vNormal = normalize(cross(toA, toB));

    // Varyings
    vPosition = gl_Position.xyz;
    vPosition.xz += uTime * 0.2;
    vUpDot = dot(vNormal, vec3(0.0, 1.0, 0.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
