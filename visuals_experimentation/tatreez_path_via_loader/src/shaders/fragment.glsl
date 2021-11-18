varying vec2 vUv;
varying float vOpacity;

void main()
{
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  vec2 centralUv = 2.0 * uv - 1.0;

  vec3 originalColor = vec3(4.0/255.0, 10.0/255.0, 20.0/255.0);
  vec4 color = vec4(0.08 / length(centralUv)); //length( centralUV)= between 0- square of 2
  color.rgb = min(vec3(10.0), color.rgb);

  color.rgb *= originalColor * 120.0;

  color *= vOpacity;

  color.a = min(1.0, color.a)* 10.0;

  float disc = length(centralUv);


  //gl_FragColor = vec4(1.0 - disc, 0.0, 0.0, 1.0 )* vOpacity;
  gl_FragColor = vec4(color.rgb, color.a);
  
  if(gl_FragColor.r<0.1 && gl_FragColor.b<0.1 && gl_FragColor.g<0.1) discard;

  //gl_FragColor = vec4(1.0);
}