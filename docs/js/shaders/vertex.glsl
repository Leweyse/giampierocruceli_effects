uniform float time;
uniform float progress;
uniform float direction;

varying vec2 vUv;
varying vec4 vPosition;

uniform vec2 pixels;

void main() {

    vec3 pos = position;

    // pos.z = 0.1 * sin(pos.x);
    float distance = length(uv - vec2(0.5));
    float maxdist = length(vec2(0.5));

    float normalizedDistance = distance / maxdist;

    float stickTo = normalizedDistance;
    float stickOut = -normalizedDistance;

    float stickEffect = mix(stickTo, stickOut, direction);

    float mySuperDuperProgress =  min(2.0 * progress, 2.0 * (1.0 - progress));
    
    float zOffset = 1.0;

    float zProgress =  mix(clamp(2.0 * progress, 0.0, 1.0), clamp(1.0 - 2.0 * (1.0 - progress), 0.0, 1.0), direction);

    pos.z += zOffset * (stickEffect*mySuperDuperProgress - zProgress);

    pos.z += progress * sin(distance * 10.0 + 2.0 * time) * 0.1;

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );;
}