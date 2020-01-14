attribute vec3 vertex_position;
attribute vec2 vertex_texCoord0;

uniform mat4 matrix_model;
uniform mat4 matrix_viewProjection;

varying vec2 vUv0;

vec4 getPosition() {
    return matrix_viewProjection * matrix_model * vec4(vertex_position, 1.0);
}

void main() {
    vUv0 = vertex_texCoord0;
    gl_Position = getPosition();
}
