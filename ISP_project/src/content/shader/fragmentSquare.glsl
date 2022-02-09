varying vec2 vUv;

void main()
{
    float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    strength *= 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    
    gl_FragColor = vec4(0.5, 0.0, 1.0, 1.0);
    gl_FragColor = vec4(vec3(strength), 1.0);
    
    if(gl_FragColor.r < 0.01 && gl_FragColor.b < 0.01 && gl_FragColor.g < 0.01) discard;

}