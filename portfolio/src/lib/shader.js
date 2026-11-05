import { reduced } from "./index.js";

/*
  Hero light: a fragment shader that draws soft, warped bands of light on black, with a
  little color fringing on the edges. It is rendered at half resolution and paused while
  the hero is off screen. Without WebGL the plain dark gradient behind it is shown.
*/

const VERTEX = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const FRAGMENT = `precision mediump float;
uniform vec2 R; uniform float T;
float band(vec2 p, float off) {
  vec2 q = p;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    q += 0.55 * sin(q.yx * (1.15 + 0.2 * fi) + T * (0.10 + 0.03 * fi) + fi * 1.9 + off);
  }
  float v = 0.5 + 0.5 * sin(q.x * 1.25 + q.y * 0.85 + off * 2.5);
  return pow(v, 7.0) * 0.9 + pow(v, 2.0) * 0.07;
}
void main() {
  vec2 uv = gl_FragCoord.xy / R;
  vec2 p = (uv - 0.5) * vec2(R.x / R.y, 1.0) * 4.6;
  float r = band(p, 0.07), g = band(p, 0.0), b = band(p, -0.09);
  vec3 col = vec3(r * 1.05, g * 0.96, b * 1.12);
  col = mix(col, col * vec3(0.38, 0.62, 1.0), 0.4);
  float d = length((uv - vec2(0.5, 0.5)) * vec2(1.25, 1.0));
  col *= mix(0.30, 1.0, smoothstep(0.08, 0.85, d));  // keep the middle calm for the name
  col = pow(col, vec3(1.08));
  gl_FragColor = vec4(col, 1.0);
}`;

export function createShader(canvas, watch) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) {
    canvas.remove();
    return { destroy() {} };
  }
  const compile = (type, src) => {
    const o = gl.createShader(type);
    gl.shaderSource(o, src);
    gl.compileShader(o);
    return o;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.remove();
    return { destroy() {} };
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(program, "R");
  const uT = gl.getUniformLocation(program, "T");

  let raf = 0;
  let visible = true;
  let alive = true;
  const t0 = performance.now();

  function size() {
    const k = 0.5;
    canvas.width = Math.max(2, Math.round(canvas.clientWidth * k));
    canvas.height = Math.max(2, Math.round(canvas.clientHeight * k));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  function frame(now) {
    if (!alive) return;
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, reduced ? 6.0 : (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = visible && !reduced ? requestAnimationFrame(frame) : 0;
  }

  size();
  const onResize = () => {
    size();
    frame(performance.now());
  };
  window.addEventListener("resize", onResize);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
  });
  io.observe(watch);
  frame(performance.now());

  return {
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    },
  };
}
