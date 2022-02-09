uniform sampler2D uTexture;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vPosition;

void main()
{
  
  vec4 videoTexture = texture2D(uTexture, vUv) * uOpacity;
  gl_FragColor = vec4(vUv, 0.0, 1.0);
  gl_FragColor = videoTexture;
}