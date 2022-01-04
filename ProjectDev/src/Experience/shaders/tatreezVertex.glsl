attribute float opacity;

varying vec2 vUv; 
varying float vOpacity;

void main()
{
    vUv = uv;
    vOpacity = opacity;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_PointSize = 20.0;
    gl_Position = projectionMatrix * viewPosition;

}