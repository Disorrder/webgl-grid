precision highp float;

varying vec2 vUv0;
varying vec2 vUv1; // real coord
varying float distToCamera;

// log10(x) = log(x) / log(10)
// LOG10 = 1. / log(10.);
#define LOG10 0.43429448190325176

float thickness = 0.01 / 2.;
float dimension = 1.; // cell size
float dimMorph = 1.; // animation between dimensions [0, 1]

vec4 COLOR_X = vec4(1., 0., 0., 1.);
vec4 COLOR_Y = vec4(0., 1., 0., 1.);
vec4 COLOR_0 = vec4(0.0);
vec4 COLOR_1 = vec4(0.3);
vec4 COLOR_2 = vec4(0.8);


void main() {
    thickness *= distToCamera / 5.;

    // var. 1
    if (distToCamera < 0.1*100.) {
        dimension = 0.1;
        dimMorph = smoothstep(dimension*100., dimension*40., distToCamera);
    } else if (distToCamera >= 0.1*100. && distToCamera < 1.*100.) {
        dimension = 1.;
        dimMorph = smoothstep(dimension*100., dimension*50., distToCamera);
    } else if (distToCamera >= 1.*100.) {
        dimension = 10.;
        dimMorph = smoothstep(dimension*100., dimension*60., distToCamera);
    }

    // var. 2 - может быть тяжелее считать
    // dimension = floor(LOG10 * log(distToCamera)) - 1.;
    // dimension = pow(10., dimension);
    // dimMorph = smoothstep(dimension*100., dimension*80., distToCamera);


    float dimMorph2 = smoothstep(0., 0.5, dimMorph);


    // vec2 uv = vUv0 * 2. - 1.; // Scale [-1, 1]
    vec2 cell = vUv1 / dimension; // cell UV
    vec2 line = ceil(cell - .5);
    vec2 div = mod(vUv1, dimension); // line smoothness alpha
    div = min(div, dimension - div);
    // if (dimension < 1.0) div *= dimension;

    // vec2 dt = fwidth(div) * 1.5; // WebGL 2.0+
    vec2 dt = vec2(0.00);
    div.x = smoothstep(div.x-dt.x, div.x+dt.x, thickness);
    div.y = smoothstep(div.y-dt.y, div.y+dt.y, thickness);
    thickness += max(dt.x, dt.y);


    float alpha = max(div.x, div.y);
    // float alpha = clamp(div.x + div.y, 0., 1.);

    if (alpha <= 0.) {
        gl_FragColor = COLOR_0;
        // gl_FragColor = vec4(div, 0., 0.99);
        // gl_FragColor = vec4(dimMorph, dimMorph2, 0., 0.1);
        return;
    }

    vec4 colorX = vec4(0.);
    vec4 colorY = vec4(0.);

    if (div.x > 0.) {
        colorX = mix(COLOR_0, COLOR_1, div.x * dimMorph);
        if (mod(line.x, 10.) == 0.) colorX = mix(COLOR_1, COLOR_2, div.x * dimMorph2);
    }
    if (div.y > 0.) {
        colorY = mix(COLOR_0, COLOR_1, div.y * dimMorph);
        if (mod(line.y, 10.) == 0.) colorY = mix(COLOR_1, COLOR_2, div.y * dimMorph2);
    }

    if (line.x == 0. && div.x > 0.) {
        // y axis (actually z axis and should be blue)
        colorX = mix(COLOR_0, COLOR_Y, div.x);
        gl_FragColor = mix(colorY, colorX, div.x);
        return;
    }
    if (line.y == 0. && div.y > 0.) {
        // x axis
        colorY = mix(COLOR_0, COLOR_X, div.y);
        gl_FragColor = mix(colorX, colorY, div.y);
        return;
    }

    gl_FragColor = max(colorX, colorY);

}
