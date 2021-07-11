uniform float time;
uniform float progress;
uniform float speed;
uniform vec2 mouse;

uniform sampler2D tex1;

uniform vec4 resolution;

varying vec2 vUv;
varying vec4 vPosition;

void main() {
    float normSpeed = clamp(speed * 35.0, 0.0, 0.25);
    float mouseDist = length(vUv - mouse);

    float c = smoothstep(0.15, 0.0, mouseDist);

    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec4 color = texture2D(tex1, newUV);

    float r = texture2D(tex1, newUV + 0.1 * 0.5 * c * normSpeed).r;
    float g = texture2D(tex1, newUV + 0.1 * 0.3 * c * normSpeed).g;
    float b = texture2D(tex1, newUV + 0.1 * 0.1 * c * normSpeed).b;

    gl_FragColor = vec4(vUv, 0.0, 1.0);
    gl_FragColor = color;

    gl_FragColor = vec4( normSpeed * mouseDist, 0.0, 0.0, 1.0 );
    gl_FragColor = vec4( c, 0.0, 0.0, 1.0 );
    gl_FragColor = vec4( r, g, b, 1.0 );;
}