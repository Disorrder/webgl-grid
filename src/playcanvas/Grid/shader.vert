attribute vec3 vertex_position;
attribute vec2 vertex_texCoord0;

uniform mat4 matrix_model;
uniform mat4 matrix_view;
uniform mat4 matrix_projection;
uniform mat4 matrix_viewProjection;

varying vec2 vUv0;
varying vec2 vUv1;
varying float distToCamera;

vec4 getPosition() {
    return matrix_viewProjection * matrix_model * vec4(vertex_position, 1.0);
}

void main() {
    vUv0 = vertex_texCoord0;
    vec4 wsPosition = matrix_model * vec4(vertex_position, 1.0); // World space
    vUv1 = vec2(wsPosition.x, wsPosition.z);

    vec4 csPosition = matrix_view * wsPosition; // Camera space
    distToCamera = -csPosition.z;
    gl_Position = matrix_projection * csPosition;
    // gl_Position = getPosition();
}
