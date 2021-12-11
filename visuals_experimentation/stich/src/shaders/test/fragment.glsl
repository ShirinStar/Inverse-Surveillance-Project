uniform float uTime;
uniform sampler2D uTexture;
uniform float uLengthStripX;
uniform float uLengthStripY;
uniform float uWidthStripX;
uniform float uWidthStripY;

varying vec2 vUv;

void main()
{
  //try to animate the value of the first step from 0-1
  //the offset i'm adding needs to be half of the step

  //also try to add to the vertex cos + sin
  float numberOfStrips = 40.0;

  float stripY = step(uWidthStripY, mod(vUv.x * numberOfStrips + 0.5, 1.0));
  stripY *= step(uLengthStripY, mod(vUv.y * numberOfStrips, 1.0));

  float stripX = step(uWidthStripX, mod(vUv.y * numberOfStrips + 0.5, 1.0));
  stripX *= step(uLengthStripX, mod(vUv.x * numberOfStrips, 1.0));

  float strength = stripY + stripX;

  strength = clamp(strength, 0.0, 1.0);

  //colors
  vec4 videoTexture = texture2D(uTexture, vUv);

  vec4 blackColor = vec4(vec3(0.0), 1.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec4 mixedColor = mix(blackColor, videoTexture, strength);

  gl_FragColor = vec4(vec3(mixedColor), 1.0);

  if(gl_FragColor.r<0.1 && gl_FragColor.b<0.1 && gl_FragColor.g<0.1) discard;

}