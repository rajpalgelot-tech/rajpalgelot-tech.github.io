// Raw WebGL port of the reference portfolio's HoverMaskReveal component
// (netxspider). The mask texture is revealed through a GPU fluid simulation:
// the cursor injects velocity and density into a staggered-grid solver held in
// ping-pong framebuffers, and the composite shader cuts the mask out with that
// density plus animated simplex noise. Shaders, parameters and frame order are
// carried over verbatim so the hover behaves exactly like the reference site.

interface HoverMaskConfig {
  maskSrc: string;
  radius: number;
  blur: number;
  circleBoost: number;
  texture: number;
  timeSpeed: number;
  splatRadius: number;
  velocityDissipation: number;
  shrinkTimeSeconds: number;
  curl: number;
  pressureIterations: number;
  parallax: boolean;
  parallaxAmount: number;
  parallaxSmoothing: number;
}

// The exact props the reference hero passes to HoverMaskReveal.
const defaults: HoverMaskConfig = {
  maskSrc: './hero-mask.png',
  radius: 130,
  blur: 0.5,
  circleBoost: 0.85,
  texture: 0.35,
  timeSpeed: 5,
  splatRadius: 0.12,
  velocityDissipation: 0.98,
  shrinkTimeSeconds: 1.4,
  curl: 35,
  pressureIterations: 25,
  parallax: true,
  parallaxAmount: 20,
  parallaxSmoothing: 0.1
};

const QUAD_VERT = `
  precision highp float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const splatFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 u_point;
  uniform vec2 u_splatColor;
  uniform float u_radius;
  uniform float u_aspectRatio;
  uniform sampler2D u_target;
  void main() {
    vec2 p = vUv - u_point;
    p.x *= max(u_aspectRatio, 1.0);
    p.y *= max(1.0 / u_aspectRatio, 1.0);
    float splat = exp(-dot(p, p) / (u_radius * u_radius));
    vec4 base = texture2D(u_target, vUv);
    base.xy += splat * u_splatColor;
    gl_FragColor = base;
  }
`;

const splatDensityFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 u_point;
  uniform float u_radius;
  uniform float u_aspectRatio;
  uniform float u_densityAmount;
  uniform sampler2D u_target;
  void main() {
    vec2 p = vUv - u_point;
    p.x *= max(u_aspectRatio, 1.0);
    p.y *= max(1.0 / u_aspectRatio, 1.0);
    float splat = exp(-dot(p, p) / (u_radius * u_radius));
    float base = texture2D(u_target, vUv).r;
    gl_FragColor = vec4(base + splat * u_densityAmount, 0.0, 0.0, 1.0);
  }
`;

const advectFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D u_velocity;
  uniform sampler2D u_source;
  uniform vec2 u_texelSize;
  uniform float u_dt;
  uniform float u_dissipationMultiply;
  void main() {
    vec2 vel = texture2D(u_velocity, vUv).xy;
    vec2 pos = vUv - vel * u_texelSize * u_dt;
    gl_FragColor = texture2D(u_source, pos) * u_dissipationMultiply;
  }
`;

const divergenceFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D u_velocity;
  uniform vec2 u_texelSize;
  void main() {
    float L = texture2D(u_velocity, vUv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture2D(u_velocity, vUv + vec2(u_texelSize.x, 0.0)).x;
    float T = texture2D(u_velocity, vUv + vec2(0.0, u_texelSize.y)).y;
    float B = texture2D(u_velocity, vUv - vec2(0.0, u_texelSize.y)).y;
    float div = 0.5 * ((R - L) + (T - B));
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const pressureFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D u_pressure;
  uniform sampler2D u_divergence;
  uniform vec2 u_texelSize;
  void main() {
    float L = texture2D(u_pressure, vUv - vec2(u_texelSize.x, 0.0)).r;
    float R = texture2D(u_pressure, vUv + vec2(u_texelSize.x, 0.0)).r;
    float T = texture2D(u_pressure, vUv + vec2(0.0, u_texelSize.y)).r;
    float B = texture2D(u_pressure, vUv - vec2(0.0, u_texelSize.y)).r;
    float C = texture2D(u_divergence, vUv).r;
    float p = (L + R + T + B - C) * 0.25;
    gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
  }
`;

const curlFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D u_velocity;
  uniform vec2 u_texelSize;
  uniform float u_curl;
  void main() {
    float vL = texture2D(u_velocity, vUv - vec2(u_texelSize.x, 0.0)).y;
    float vR = texture2D(u_velocity, vUv + vec2(u_texelSize.x, 0.0)).y;
    float vT = texture2D(u_velocity, vUv + vec2(0.0, u_texelSize.y)).x;
    float vB = texture2D(u_velocity, vUv - vec2(0.0, u_texelSize.y)).x;
    float curl = (vR - vL) - (vT - vB);
    vec2 vel = texture2D(u_velocity, vUv).xy;
    float strength = u_curl * 0.00015;
    vel.x += strength * (vT - vB);
    vel.y += strength * (vL - vR);
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`;

const gradientFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D u_velocity;
  uniform sampler2D u_pressure;
  uniform vec2 u_texelSize;
  void main() {
    float L = texture2D(u_pressure, vUv - vec2(u_texelSize.x, 0.0)).r;
    float R = texture2D(u_pressure, vUv + vec2(u_texelSize.x, 0.0)).r;
    float T = texture2D(u_pressure, vUv + vec2(0.0, u_texelSize.y)).r;
    float B = texture2D(u_pressure, vUv - vec2(0.0, u_texelSize.y)).r;
    vec2 vel = texture2D(u_velocity, vUv).xy;
    vel.x -= 0.5 * (R - L);
    vel.y -= 0.5 * (T - B);
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`;

const compositeFrag = `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_progress;
  uniform vec2 u_planeRes;
  uniform float u_radius;
  uniform float u_blur;
  uniform float u_circleBoost;
  uniform float u_noiseFreq;
  uniform float u_noiseStrength;
  uniform float u_noiseSize;
  uniform float u_timeSpeed;
  uniform sampler2D u_frontImage;
  uniform float u_frontImageAspect;
  uniform float u_containerAspect;
  uniform vec2 u_windowSize;
  uniform vec2 u_containerOffset;
  uniform vec2 u_parallaxOffset;
  uniform float u_parallaxMax;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  uniform sampler2D u_densityTex;

  void main() {
    vec2 uv = vUv;
    float density = texture2D(u_densityTex, uv).r * u_circleBoost * u_progress;

    float offx = uv.x + (u_time * u_timeSpeed * 0.1) + sin(uv.y + u_time * u_timeSpeed * 0.1);
    float offy = uv.y - cos(u_time * u_timeSpeed * 0.001) * 0.01;
    float effectiveNoiseFreq = u_noiseFreq / u_noiseSize;
    float n1 = snoise(vec3(offx * effectiveNoiseFreq, offy * effectiveNoiseFreq, u_time * u_timeSpeed)) - 1.0;
    float n2 = snoise(vec3(offx * effectiveNoiseFreq * 0.5, offy * effectiveNoiseFreq * 0.5, u_time * u_timeSpeed * 0.7)) - 1.0;
    float n = (n1 + n2 * 0.5) * 0.7;

    float finalMask = smoothstep(0.35, 0.55, (n * u_noiseStrength) + pow(density, 1.5));

    vec2 responsiveUV = uv;
    if (u_frontImageAspect > 0.0 && u_containerAspect > 0.0) {
      if (u_frontImageAspect > u_containerAspect) {
        float scale = u_frontImageAspect / u_containerAspect;
        responsiveUV.x = (uv.x - 0.5) / scale + 0.5;
      } else {
        float scale = u_containerAspect / u_frontImageAspect;
        responsiveUV.y = (uv.y - 0.5) / scale + 0.5;
      }
    }

    vec2 inset = u_parallaxMax / u_planeRes;
    vec2 baseUV = inset + responsiveUV * (1.0 - 2.0 * inset);
    vec2 parallaxUV = u_parallaxOffset / u_planeRes;
    vec2 sampleUV = baseUV + parallaxUV;

    vec4 frontColor = texture2D(u_frontImage, sampleUV);
    float outAlpha = frontColor.a * finalMask;
    if (outAlpha < 0.01) outAlpha = 0.0;

    gl_FragColor = vec4(frontColor.rgb, outAlpha);
  }
`;

interface RT {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
}

interface Pass {
  program: WebGLProgram;
  locations: Map<string, WebGLUniformLocation | null>;
}

export function mountHoverMask(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  maskSrc: string = defaults.maskSrc
): void {
  const cfg = defaults;

  // Half-float render targets are required for the fluid state; without them
  // the effect silently stays off and the portrait keeps its plain hover.
  const attrs: WebGLContextAttributes = { alpha: true, antialias: true, premultipliedAlpha: true };
  let gl: WebGLRenderingContext | null = canvas.getContext('webgl2', attrs);
  let internalFormat = 0;
  let texType = 0;
  if (gl && gl.getExtension('EXT_color_buffer_float')) {
    internalFormat = (gl as WebGL2RenderingContext).RGBA16F;
    texType = (gl as WebGL2RenderingContext).HALF_FLOAT;
  } else {
    gl = null;
  }
  if (!gl) {
    const gl1 = canvas.getContext('webgl', attrs);
    const halfFloat = gl1 ? gl1.getExtension('OES_texture_half_float') : null;
    const renderable = gl1 ? gl1.getExtension('EXT_color_buffer_half_float') : null;
    const linear = gl1 ? gl1.getExtension('OES_texture_half_float_linear') : null;
    if (gl1 && halfFloat && renderable && linear && halfFloat.HALF_FLOAT_OES !== undefined) {
      gl = gl1;
      internalFormat = gl1.RGBA;
      texType = halfFloat.HALF_FLOAT_OES;
    } else {
      return;
    }
  }
  const glc = gl as WebGLRenderingContext;

  const compile = (type: number, src: string): WebGLShader => {
    const shader = glc.createShader(type) as WebGLShader;
    glc.shaderSource(shader, src);
    glc.compileShader(shader);
    if (!glc.getShaderParameter(shader, glc.COMPILE_STATUS)) {
      throw new Error(glc.getShaderInfoLog(shader) ?? 'shader compile failed');
    }
    return shader;
  };

  const makePass = (frag: string): Pass => {
    const program = glc.createProgram() as WebGLProgram;
    glc.attachShader(program, compile(glc.VERTEX_SHADER, QUAD_VERT));
    glc.attachShader(program, compile(glc.FRAGMENT_SHADER, frag));
    glc.linkProgram(program);
    if (!glc.getProgramParameter(program, glc.LINK_STATUS)) {
      throw new Error(glc.getProgramInfoLog(program) ?? 'program link failed');
    }
    return { program, locations: new Map() };
  };

  const loc = (pass: Pass, name: string): WebGLUniformLocation | null => {
    if (!pass.locations.has(name)) {
      pass.locations.set(name, glc.getUniformLocation(pass.program, name));
    }
    return pass.locations.get(name) ?? null;
  };

  const pSplatVel = makePass(splatFrag);
  const pSplatDensity = makePass(splatDensityFrag);
  const pAdvect = makePass(advectFrag);
  const pDivergence = makePass(divergenceFrag);
  const pPressure = makePass(pressureFrag);
  const pCurl = makePass(curlFrag);
  const pGradient = makePass(gradientFrag);
  const pComposite = makePass(compositeFrag);

  // Fullscreen quad, interleaved position + uv, matching PlaneGeometry uv space.
  const quadBuf = glc.createBuffer() as WebGLBuffer;
  glc.bindBuffer(glc.ARRAY_BUFFER, quadBuf);
  glc.bufferData(
    glc.ARRAY_BUFFER,
    new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
       1,  1, 1, 1,
      -1, -1, 0, 0,
       1,  1, 1, 1,
      -1,  1, 0, 1
    ]),
    glc.STATIC_DRAW
  );

  const drawQuad = (pass: Pass): void => {
    const pos = glc.getAttribLocation(pass.program, 'position');
    const uv = glc.getAttribLocation(pass.program, 'uv');
    glc.bindBuffer(glc.ARRAY_BUFFER, quadBuf);
    glc.enableVertexAttribArray(pos);
    glc.vertexAttribPointer(pos, 2, glc.FLOAT, false, 16, 0);
    if (uv >= 0) {
      glc.enableVertexAttribArray(uv);
      glc.vertexAttribPointer(uv, 2, glc.FLOAT, false, 16, 8);
    }
    glc.drawArrays(glc.TRIANGLES, 0, 6);
  };

  const createRT = (w: number, h: number): RT => {
    const tex = glc.createTexture() as WebGLTexture;
    glc.bindTexture(glc.TEXTURE_2D, tex);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.LINEAR);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.LINEAR);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
    glc.texImage2D(glc.TEXTURE_2D, 0, internalFormat, w, h, 0, glc.RGBA, texType, null);
    const fbo = glc.createFramebuffer() as WebGLFramebuffer;
    glc.bindFramebuffer(glc.FRAMEBUFFER, fbo);
    glc.framebufferTexture2D(glc.FRAMEBUFFER, glc.COLOR_ATTACHMENT0, glc.TEXTURE_2D, tex, 0);
    glc.bindFramebuffer(glc.FRAMEBUFFER, null);
    return { tex, fbo };
  };

  const destroyRT = (rt: RT): void => {
    glc.deleteTexture(rt.tex);
    glc.deleteFramebuffer(rt.fbo);
  };

  // 1x1 transparent placeholder until the mask texture arrives.
  const emptyTex = glc.createTexture() as WebGLTexture;
  glc.bindTexture(glc.TEXTURE_2D, emptyTex);
  glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.LINEAR);
  glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.LINEAR);
  glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
  glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
  glc.texImage2D(glc.TEXTURE_2D, 0, glc.RGBA, 1, 1, 0, glc.RGBA, glc.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

  let frontTex: WebGLTexture = emptyTex;
  let frontImageAspect = 1;
  const maskImg = new Image();
  maskImg.onload = (): void => {
    const tex = glc.createTexture() as WebGLTexture;
    glc.bindTexture(glc.TEXTURE_2D, tex);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.LINEAR);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.LINEAR);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
    glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
    glc.texImage2D(glc.TEXTURE_2D, 0, glc.RGBA, glc.RGBA, glc.UNSIGNED_BYTE, maskImg);
    frontTex = tex;
    frontImageAspect = maskImg.width / maskImg.height;
  };
  maskImg.src = maskSrc;

  // The solver runs at half the container resolution, like the reference.
  let cssW = 0;
  let cssH = 0;
  let simW = 1;
  let simH = 1;
  let vel0: RT;
  let vel1: RT;
  let divRT: RT;
  let pressure0: RT;
  let pressure1: RT;
  let density0: RT;
  let density1: RT;

  const allocFBOs = (): void => {
    [vel0, vel1, divRT, pressure0, pressure1, density0, density1].forEach((rt) => {
      if (rt) destroyRT(rt);
    });
    vel0 = createRT(simW, simH);
    vel1 = createRT(simW, simH);
    divRT = createRT(simW, simH);
    pressure0 = createRT(simW, simH);
    pressure1 = createRT(simW, simH);
    density0 = createRT(simW, simH);
    density1 = createRT(simW, simH);
  };

  let bounds = host.getBoundingClientRect();
  let canvasW = 2;
  let canvasH = 2;

  const resize = (): void => {
    const w = Math.max(host.clientWidth, 2);
    const h = Math.max(host.clientHeight, 2);
    const newSimW = Math.max(1, Math.floor(w * 0.5));
    const newSimH = Math.max(1, Math.floor(h * 0.5));
    if (w === cssW && h === cssH && newSimW === simW && newSimH === simH) {
      bounds = host.getBoundingClientRect();
      return;
    }
    cssW = w;
    cssH = h;
    simW = newSimW;
    simH = newSimH;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(2, Math.round(w * dpr));
    canvas.height = Math.max(2, Math.round(h * dpr));
    canvasW = canvas.width;
    canvasH = canvas.height;
    allocFBOs();
    bounds = host.getBoundingClientRect();
  };
  resize();

  const state = {
    time: 0,
    lastFrame: performance.now(),
    mouseX: 0.5,
    mouseY: 0.5,
    lastMouseX: 0.5,
    lastMouseY: 0.5,
    progress: 0,
    targetProgress: 0,
    hoverActive: false,
    settleUntil: 0,
    parallaxX: 0,
    parallaxY: 0,
    targetParallaxX: 0,
    targetParallaxY: 0,
    intersecting: bounds.top < window.innerHeight && bounds.bottom > 0,
    pageVisible: document.visibilityState === 'visible',
    animating: false
  };

  const shouldAnimate = (): boolean =>
    state.pageVisible && state.intersecting && (state.hoverActive || performance.now() < state.settleUntil);

  const runPass = (pass: Pass, target: RT | null, w: number, h: number): void => {
    glc.bindFramebuffer(glc.FRAMEBUFFER, target ? target.fbo : null);
    glc.viewport(0, 0, w, h);
    glc.useProgram(pass.program);
    drawQuad(pass);
  };

  const bindTex = (pass: Pass, name: string, unit: number, tex: WebGLTexture): void => {
    glc.activeTexture(glc.TEXTURE0 + unit);
    glc.bindTexture(glc.TEXTURE_2D, tex);
    glc.uniform1i(loc(pass, name), unit);
  };

  const frame = (): void => {
    if (!shouldAnimate()) {
      state.animating = false;
      return;
    }
    state.animating = true;
    const now = performance.now();
    const dt = (now - state.lastFrame) / 1000;
    state.lastFrame = now;
    state.time += dt;

    // Parallax eases toward the cursor-driven target with a time-constant tau.
    const s = Math.max(0, Math.min(1, cfg.parallaxSmoothing));
    if (!cfg.parallax || s === 0) {
      state.parallaxX = state.targetParallaxX;
      state.parallaxY = state.targetParallaxY;
    } else {
      const tau = 0.04 + (0.25 - 0.04) * s;
      const alpha = 1 - Math.exp(-dt / tau);
      state.parallaxX += (state.targetParallaxX - state.parallaxX) * alpha;
      state.parallaxY += (state.targetParallaxY - state.parallaxY) * alpha;
    }

    const mvx = state.mouseX - state.lastMouseX;
    const mvy = state.mouseY - state.lastMouseY;
    state.lastMouseX = state.mouseX;
    state.lastMouseY = state.mouseY;

    const containerAspect = cssW / cssH;
    const texelX = 1 / simW;
    const texelY = 1 / simH;
    const velDiss = Math.max(0.9, Math.min(1, cfg.velocityDissipation));
    const T = Math.max(0.5, Math.min(10, cfg.shrinkTimeSeconds));
    const denDiss = Math.pow(0.01, 1 / (60 * T));
    const iterations = Math.max(10, Math.min(50, Math.round(cfg.pressureIterations)));

    glc.disable(glc.BLEND);

    // 1) Splat velocity
    glc.useProgram(pSplatVel.program);
    glc.uniform2f(loc(pSplatVel, 'u_point'), state.mouseX, state.mouseY);
    glc.uniform2f(loc(pSplatVel, 'u_splatColor'), mvx * 30, mvy * 30);
    glc.uniform1f(loc(pSplatVel, 'u_radius'), cfg.splatRadius);
    glc.uniform1f(loc(pSplatVel, 'u_aspectRatio'), containerAspect);
    bindTex(pSplatVel, 'u_target', 0, vel0.tex);
    runPass(pSplatVel, vel1, simW, simH);

    // 2) Splat density
    glc.useProgram(pSplatDensity.program);
    glc.uniform2f(loc(pSplatDensity, 'u_point'), state.mouseX, state.mouseY);
    glc.uniform1f(loc(pSplatDensity, 'u_radius'), cfg.splatRadius);
    glc.uniform1f(loc(pSplatDensity, 'u_aspectRatio'), containerAspect);
    glc.uniform1f(loc(pSplatDensity, 'u_densityAmount'), 1);
    bindTex(pSplatDensity, 'u_target', 0, density0.tex);
    runPass(pSplatDensity, density1, simW, simH);

    // 3) Advect velocity
    glc.useProgram(pAdvect.program);
    glc.uniform2f(loc(pAdvect, 'u_texelSize'), texelX, texelY);
    glc.uniform1f(loc(pAdvect, 'u_dt'), 1);
    glc.uniform1f(loc(pAdvect, 'u_dissipationMultiply'), velDiss);
    bindTex(pAdvect, 'u_velocity', 0, vel1.tex);
    bindTex(pAdvect, 'u_source', 1, vel1.tex);
    runPass(pAdvect, vel0, simW, simH);

    // 3b) Curl
    glc.useProgram(pCurl.program);
    glc.uniform2f(loc(pCurl, 'u_texelSize'), texelX, texelY);
    glc.uniform1f(loc(pCurl, 'u_curl'), cfg.curl);
    bindTex(pCurl, 'u_velocity', 0, vel0.tex);
    runPass(pCurl, vel1, simW, simH);

    // 4) Divergence
    glc.useProgram(pDivergence.program);
    glc.uniform2f(loc(pDivergence, 'u_texelSize'), texelX, texelY);
    bindTex(pDivergence, 'u_velocity', 0, vel1.tex);
    runPass(pDivergence, divRT, simW, simH);

    // 5) Pressure
    let pressureRead = pressure0;
    let pressureWrite = pressure1;
    glc.useProgram(pPressure.program);
    glc.uniform2f(loc(pPressure, 'u_texelSize'), texelX, texelY);
    for (let i = 0; i < iterations; i++) {
      bindTex(pPressure, 'u_pressure', 0, pressureRead.tex);
      bindTex(pPressure, 'u_divergence', 1, divRT.tex);
      runPass(pPressure, pressureWrite, simW, simH);
      const tmp = pressureRead;
      pressureRead = pressureWrite;
      pressureWrite = tmp;
    }

    // 6) Gradient subtract
    glc.useProgram(pGradient.program);
    glc.uniform2f(loc(pGradient, 'u_texelSize'), texelX, texelY);
    bindTex(pGradient, 'u_velocity', 0, vel1.tex);
    bindTex(pGradient, 'u_pressure', 1, pressureRead.tex);
    runPass(pGradient, vel0, simW, simH);

    // 7) Advect density
    glc.useProgram(pAdvect.program);
    glc.uniform2f(loc(pAdvect, 'u_texelSize'), texelX, texelY);
    glc.uniform1f(loc(pAdvect, 'u_dt'), 1);
    glc.uniform1f(loc(pAdvect, 'u_dissipationMultiply'), denDiss);
    bindTex(pAdvect, 'u_velocity', 0, vel0.tex);
    bindTex(pAdvect, 'u_source', 1, density1.tex);
    runPass(pAdvect, density0, simW, simH);

    // Composite: cut the mask out with density + animated noise.
    glc.bindFramebuffer(glc.FRAMEBUFFER, null);
    glc.viewport(0, 0, canvasW, canvasH);
    glc.clearColor(0, 0, 0, 0);
    glc.clear(glc.COLOR_BUFFER_BIT);
    glc.enable(glc.BLEND);
    glc.blendFunc(glc.SRC_ALPHA, glc.ONE_MINUS_SRC_ALPHA);
    glc.useProgram(pComposite.program);
    glc.uniform1f(loc(pComposite, 'u_time'), state.time);
    glc.uniform2f(loc(pComposite, 'u_mouse'), state.mouseX, state.mouseY);
    glc.uniform2f(loc(pComposite, 'u_planeRes'), cssW, cssH);
    glc.uniform1f(loc(pComposite, 'u_radius'), 10 + (cfg.radius - 10) * (190 / 990));
    glc.uniform1f(loc(pComposite, 'u_blur'), 0.2 + cfg.blur * 2.8);
    glc.uniform1f(loc(pComposite, 'u_circleBoost'), 0.5 + cfg.circleBoost * 3.5);
    glc.uniform1f(loc(pComposite, 'u_noiseFreq'), 2 + cfg.texture * 12);
    glc.uniform1f(loc(pComposite, 'u_noiseStrength'), cfg.texture * 3);
    glc.uniform1f(loc(pComposite, 'u_noiseSize'), 1 - cfg.texture * 0.7);
    glc.uniform1f(loc(pComposite, 'u_timeSpeed'), cfg.timeSpeed * 0.1);
    glc.uniform1f(loc(pComposite, 'u_frontImageAspect'), frontImageAspect);
    glc.uniform1f(loc(pComposite, 'u_containerAspect'), containerAspect);
    glc.uniform2f(loc(pComposite, 'u_windowSize'), window.innerWidth, window.innerHeight);
    glc.uniform2f(loc(pComposite, 'u_containerOffset'), bounds.left, bounds.top);
    glc.uniform2f(loc(pComposite, 'u_parallaxOffset'), state.parallaxX, state.parallaxY);
    glc.uniform1f(
      loc(pComposite, 'u_parallaxMax'),
      cfg.parallax ? Math.max(0, Math.min(200, cfg.parallaxAmount)) : 0
    );
    bindTex(pComposite, 'u_densityTex', 0, density0.tex);
    bindTex(pComposite, 'u_frontImage', 1, frontTex);
    state.progress += (state.targetProgress - state.progress) * 0.08;
    glc.uniform1f(loc(pComposite, 'u_progress'), state.progress);
    drawQuad(pComposite);

    if (shouldAnimate()) {
      requestAnimationFrame(frame);
    } else {
      state.animating = false;
    }
  };

  const kick = (): void => {
    if (!state.animating && shouldAnimate()) {
      frame();
    }
  };

  const clearFluidFBOs = (): void => {
    glc.clearColor(0, 0, 0, 0);
    [density0, density1, vel0, vel1].forEach((rt) => {
      glc.bindFramebuffer(glc.FRAMEBUFFER, rt.fbo);
      glc.clear(glc.COLOR_BUFFER_BIT);
    });
    glc.bindFramebuffer(glc.FRAMEBUFFER, null);
  };

  const onEnter = (): void => {
    clearFluidFBOs();
    state.hoverActive = true;
    state.settleUntil = Number.POSITIVE_INFINITY;
    state.targetProgress = 1;
    kick();
  };

  const onLeave = (): void => {
    state.hoverActive = false;
    state.settleUntil = performance.now() + Math.max(0.5, cfg.shrinkTimeSeconds) * 1000 + 250;
    state.targetProgress = 0;
    state.targetParallaxX = 0;
    state.targetParallaxY = 0;
    if (!cfg.parallax || Math.max(0, Math.min(1, cfg.parallaxSmoothing)) === 0) {
      state.parallaxX = 0;
      state.parallaxY = 0;
    }
  };

  const setPointer = (clientX: number, clientY: number): void => {
    const x = (clientX - bounds.left) / bounds.width;
    const y = 1 - (clientY - bounds.top) / bounds.height;
    state.mouseX = Math.max(0, Math.min(1, x));
    state.mouseY = Math.max(0, Math.min(1, y));
    if (cfg.parallax && cfg.parallaxAmount > 0) {
      const px = Math.max(0, Math.min(200, cfg.parallaxAmount));
      state.targetParallaxX = Math.max(-px, Math.min(px, (state.mouseX - 0.5) * 2 * px));
      state.targetParallaxY = Math.max(-px, Math.min(px, (state.mouseY - 0.5) * 2 * px));
    }
  };

  const onMove = (e: MouseEvent): void => {
    if (!state.hoverActive) onEnter();
    kick();
    setPointer(e.clientX, e.clientY);
  };

  const onTouchMove = (e: TouchEvent): void => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    onMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
  };

  const onTouchStart = (e: TouchEvent): void => {
    onEnter();
    if (e.touches.length > 0) {
      setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  host.addEventListener('mousemove', onMove);
  host.addEventListener('mouseenter', onEnter);
  host.addEventListener('mouseleave', onLeave);
  host.addEventListener('touchmove', onTouchMove, { passive: true });
  host.addEventListener('touchstart', onTouchStart, { passive: true });
  host.addEventListener('touchend', onLeave);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        state.intersecting = entry.isIntersecting;
        if (entry.isIntersecting) kick();
      });
    },
    { root: null, rootMargin: '50px', threshold: 0.01 }
  );
  intersectionObserver.observe(host);

  document.addEventListener('visibilitychange', () => {
    state.pageVisible = document.visibilityState === 'visible';
    state.lastFrame = performance.now();
    if (state.pageVisible) kick();
  });

  window.addEventListener('scroll', () => {
    bounds = host.getBoundingClientRect();
  }, { passive: true });

  window.addEventListener('resize', resize);
  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(host);
}
