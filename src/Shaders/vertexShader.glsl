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
    vec3 newPosition = position;

    // Neighbours positions
    float shift = 0.01;
    vec3 positionA = position.xyz + vec3(0.0, shift, 0.0);
    vec3 positionB = position.xyz + vec3(shift, 0.0, 0.0);

    // Elevation
    float elevation = getElevation(newPosition.xy);
    newPosition.z += elevation;
    positionA.z += getElevation(positionA.xy);
    positionB.z += getElevation(positionB.xy);

    // Compute normal
    vec3 toA = normalize(positionA - newPosition);
    vec3 toB = normalize(positionB - newPosition);
    vNormal = normalize(cross(toA, toB));

    // Varyings
    vPosition = newPosition.xyz;
    vPosition.xy += uTime * 0.2;
    vUpDot = dot(vNormal, vec3(0.0, 1.0, 0.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
