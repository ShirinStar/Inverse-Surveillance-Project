uniform sampler2D uTexture;
uniform float uOpacity;

varying vec2 vUv;
varying float vOpacity;

void main()
{
  vec4 videoTexture = texture2D(uTexture, vUv);
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  vec2 centralUv = 2.0 * uv - 1.0;

  vec4 originalColor = texture2D(uTexture, vUv);
  vec4 color = vec4(0.08 / length(centralUv)); //length( centralUV)= between 0- square of 2
  color.rgb = min(vec3(10.0), color.rgb);

  color *= originalColor * 40.0;

  color *= vOpacity;

  color.a = min(1.0, color.a)* 10.0;

  float disc = length(centralUv);


  // gl_FragColor = vec4(1.0 - disc, 0.0, 0.0, 1.0 )* vOpacity;
  gl_FragColor = vec4(color) * uOpacity;
  
  //if(gl_FragColor.r<0.1 && gl_FragColor.b<0.1 && gl_FragColor.g<0.1) discard;

  //gl_FragColor = vec4(1.0);
}