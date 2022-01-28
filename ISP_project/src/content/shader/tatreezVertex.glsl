attribute float opacity;

uniform float uPointSize;
uniform float uRangePointsRandom;

varying vec2 vUv; 
varying float vOpacity;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main()
{
    vUv = uv;
    vOpacity = opacity;

    vec2 randomValueYZ = position.yz;
    vec2 randomValueXZ = position.xz;
    float rnd = random(randomValueYZ);
    rnd += random(randomValueXZ);

    vec4 modelPosition = modelMatrix * vec4(position + rnd * uRangePointsRandom, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_PointSize = uPointSize;
    gl_Position = projectionMatrix * viewPosition;

}