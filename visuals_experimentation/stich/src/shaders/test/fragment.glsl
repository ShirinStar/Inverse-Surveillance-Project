uniform float uTime;
varying vec2 vUv;

void main()
{
  //try to animate the value of the first step from 0-1
  //the offset i'm adding needs to be half of the step

  //also try to add to the verrtex cos + sin

  float stripY = step(0.9, mod(vUv.x * 80.0 + 0.5, 1.0));
  stripY *= step(.1, mod(vUv.y * 80.0, 1.0));

  float stripX = step(0.9, mod(vUv.y * 80.0 + 0.5, 1.0));
  stripX *= step(.1, mod(vUv.x * 80.0, 1.0));

  float strength = stripY + stripX;

  strength = clamp(strength, 0.0, 1.0);

  //colors
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, strength);

  gl_FragColor = vec4(vec3(mixedColor), 1.0);

  if(gl_FragColor.r<0.1 && gl_FragColor.b<0.1 && gl_FragColor.g<0.1) discard;

}