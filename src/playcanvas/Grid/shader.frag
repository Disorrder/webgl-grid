#version 300 es
precision highp float;

out vec4 fragmentColor;

in vec2 vUv0;

uniform float uDivisions;

float thickness = 0.01;

void main() {
    vec2 uv = vUv0 * 2.0 - 1.0; // Scale [-1, 1]
    vec2 line = uv * uDivisions;
    vec2 div = fract(line);
    div = min(div, 1.0 - div);
    vec2 dt = fwidth(div) * 1.5;
    div.x = smoothstep(div.x-dt.x, div.x+dt.x, thickness);
    div.y = smoothstep(div.y-dt.y, div.y+dt.y, thickness);

    float alpha = clamp(div.x + div.y, 0.0, 1.0);
    vec3 color = vec3(alpha);

    if (alpha == 0.0) {
        fragmentColor = vec4(0.0);
        return;
    }

    float brightness = 1.0;
    // float linex = floor(line.x + thickness);
    // float liney = floor(line.y + thickness);
    if (abs(line.y) < 0.5 && div.y > 0.0) {
        // x axis
        color = vec3(alpha, 0.0, 0.0);
    } else if (abs(line.x) < 0.5 && div.x > 0.0) {
        // y axis
        color = vec3(0.0, alpha, 0.0);
    } else if (alpha > 0.0) {
        brightness = 0.3;
        // every 10th axes are brighter
        if (mod(abs(line.x) + thickness, 10.0) < thickness * 2.0) brightness = 0.8;
        if (mod(abs(line.y) + thickness, 10.0) < thickness * 2.0) brightness = 0.8;
        color *= brightness;
    }

    fragmentColor = vec4(color, alpha*brightness);
}
