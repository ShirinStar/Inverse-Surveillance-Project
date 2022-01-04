uniform sampler2D uTexture;
uniform sampler2D uAlphaMap;
//uniform float uOpacity;

varying vec2 vUv;
varying float vOpacity;

void main()
{
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  vec2 centralUv = 2.0 * uv - 1.0;

   vec4 videoTexture = texture2D(uTexture, centralUv);
  
  vec4 color = vec4(0.05 / length(centralUv)); //length( centralUV)= between 0- square of 2
  color.rgb = min(vec3(10.0), color.rgb);

  color.rgb *= videoTexture.rgb * 2.0;

  color *= vOpacity;

  color.a = min(1.0, color.a) * 20.0;

  //float disc = length(centralUv * 2.0);


  //shaping circle particles
  float strength = step(0.5, distance(uv, vec2(0.5)) );

  //adding video color
  vec3 mixedColor = mix(videoTexture.rgb, color.rgb, strength);

  gl_FragColor = vec4(vec3(mixedColor * 1.3), color.a * 2.0);

  if(gl_FragColor.r<0.1 && gl_FragColor.b<0.1 && gl_FragColor.g<0.1) discard;
}