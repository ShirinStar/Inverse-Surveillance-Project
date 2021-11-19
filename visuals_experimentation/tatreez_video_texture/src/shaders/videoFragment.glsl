uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uPointScale;
varying vec2 vUv;
varying vec3 vPosition;
uniform float uWidthSegments;

void main()
{
  float strength = step(uPointScale, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
strength *= 1.0 - step(1.0, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  vec4 videoTexture = texture2D(uTexture, vUv);
  gl_FragColor = vec4(vUv, 0.0, 1.0);
  gl_FragColor = videoTexture * uOpacity;
  // gl_FragColor = vec4(vec3(strength), 1.0);
}