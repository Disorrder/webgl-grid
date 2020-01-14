precision highp float;

varying vec2 vUv0;

uniform float uDivisions;

float thickness = 0.01 / 2.0;

void main() {
    vec2 uv = vUv0 * 2.0 - 1.0; // Scale [-1, 1]
    vec2 line = uv * uDivisions;
    vec2 div = fract(line);
    div = min(div, 1.0 - div);
    // vec2 dt = fwidth(div) * 1.5; // WebGL 2.0+
    vec2 dt = vec2(0.002);
    div.x = smoothstep(div.x-dt.x, div.x+dt.x, thickness);
    div.y = smoothstep(div.y-dt.y, div.y+dt.y, thickness);
    thickness += max(dt.x, dt.y);
    // thickness *= 2.0;

    float alpha = max(div.x, div.y);
    // float alpha = clamp(div.x + div.y, 0.0, 1.0);

    if (alpha == 0.0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    vec4 colorX = vec4(0.0);
    vec4 colorY = vec4(0.0);

    if (div.x > 0.0) {
        colorX = vec4(div.x, div.x, div.x, 0.3);
        if (mod(abs(line.x)+thickness, 10.0) < thickness*2.0) colorX.a = 0.8;
    }
    if (div.y > 0.0) {
        colorY = vec4(div.y, div.y, div.y, 0.3);
        if (mod(abs(line.y)+thickness, 10.0) < thickness*2.0) colorY.a = 0.8;
    }

    if (abs(line.x) < thickness && div.x > 0.0) {
        // y axis
        colorX = vec4(0.0, div.x, 0.0, div.x);
        gl_FragColor = mix(colorY, colorX, div.x);
        return;
    }
    if (abs(line.y) < thickness && div.y > 0.0 ) {
        // x axis
        colorY = vec4(div.y, 0.0, 0.0, div.y);
        gl_FragColor = mix(colorX, colorY, div.y);
        return;
    }

    gl_FragColor = max(colorX, colorY);

}
