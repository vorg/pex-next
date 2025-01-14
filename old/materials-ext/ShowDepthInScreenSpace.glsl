#ifdef VERT

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float near;
uniform float far;
uniform vec4 farColor;
uniform vec4 nearColor;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
varying vec4 vColor;
void main() {
  vec4 pos = modelViewMatrix * vec4(position, 1.0);
  gl_Position = vec4((texCoord - 0.5)*2.0, 0.0, 1.0);
  float depth = clamp((-pos.z - near) / (far - near), 0.0, 1.0);
  vColor = mix(nearColor, farColor, depth);
}

#endif

#ifdef FRAG

varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}

#endif
