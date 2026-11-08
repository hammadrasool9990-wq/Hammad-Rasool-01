import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { bus } from "@/lib/bus";
import { samplePortrait, sampleDisc } from "./sample";

const vertex = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec3 aScatter;
  attribute vec4 aRand; // x: seed, y: size, z: ember (0/1), w: alpha
  uniform float uTime;
  uniform float uAssemble;
  uniform float uBurst;
  uniform float uScatter;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  varying float vAlpha;
  varying float vEmber;
  varying float vLight;

  void main() {
    float seed = aRand.x;
    float a = clamp(uAssemble * 1.45 - seed * 0.45, 0.0, 1.0);
    a = a * a * (3.0 - 2.0 * a);

    vec3 drift = vec3(
      sin(uTime * 0.6 + seed * 40.0),
      cos(uTime * 0.5 + seed * 31.0),
      sin(uTime * 0.4 + seed * 17.0)
    ) * vec3(0.018, 0.018, 0.04);

    vec3 cloud = aScatter * uBurst
      + vec3(sin(uTime * 0.21 + seed * 10.0), cos(uTime * 0.17 + seed * 7.0), 0.0) * 0.18 * uBurst;

    vec3 pos = mix(cloud, aTarget, a) + drift * (1.0 - a * 0.5);

    // Scroll: the portrait dissolves back into noise.
    pos += aScatter * uScatter * 1.2 + vec3(0.0, uScatter * (seed - 0.3) * 1.6, uScatter * seed * 1.5);

    // Pointer: nearby particles scatter, then drift home.
    vec2 d = pos.xy - uMouse;
    float dist = length(d);
    float f = smoothstep(0.42, 0.0, dist) * uMouseStrength;
    pos.xy += normalize(d + 1e-4) * f * 0.32;
    pos.z += f * 0.5;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aRand.y * uPixelRatio / -mv.z * (1.0 + f * 1.2);

    vAlpha = aRand.w * (0.25 + 0.75 * a) * (1.0 - uScatter * 0.7);
    vEmber = aRand.z;
    vLight = f;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uSignal;
  uniform vec3 uEmber;
  uniform vec3 uBone;
  varying float vAlpha;
  varying float vEmber;
  varying float vLight;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float s = smoothstep(0.5, 0.05, d);
    vec3 col = mix(uSignal, uBone, 0.18 + vLight * 0.5);
    col = mix(col, uEmber, vEmber);
    gl_FragColor = vec4(col, s * vAlpha);
  }
`;

export type Engine = { destroy: () => void };

export async function startParticles(
  container: HTMLElement,
  opts: { src: string; trigger: HTMLElement; onReady?: () => void },
): Promise<Engine> {
  const small = innerWidth < 760 || (navigator.hardwareConcurrency ?? 8) <= 4;
  const COUNT = small ? 3600 : 10000;

  let sampled;
  try {
    sampled = await samplePortrait(opts.src, COUNT);
  } catch {
    sampled = sampleDisc(COUNT);
  }

  const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  const dpr = Math.min(devicePixelRatio, small ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.2s";
  container.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 6);
  const group = new Group();
  scene.add(group);

  // Geometry
  const target = new Float32Array(COUNT * 3);
  const scatter = new Float32Array(COUNT * 3);
  const rand = new Float32Array(COUNT * 4);
  const HEIGHT = 3.3;
  for (let i = 0; i < COUNT; i++) {
    target[i * 3] = sampled.positions[i * 3] * HEIGHT;
    target[i * 3 + 1] = sampled.positions[i * 3 + 1] * HEIGHT;
    target[i * 3 + 2] = sampled.positions[i * 3 + 2] * HEIGHT;

    // Scatter: a wide, flattened shell of noise around the portrait.
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const r = 1.6 + Math.random() * 3.6;
    scatter[i * 3] = Math.sin(ph) * Math.cos(th) * r * 1.6;
    scatter[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * r;
    scatter[i * 3 + 2] = Math.cos(ph) * r * 0.5;

    const l = sampled.lum[i];
    rand[i * 4] = Math.random();
    rand[i * 4 + 1] = 0.55 + Math.random() * 0.7 + l * 0.5;
    rand[i * 4 + 2] = Math.random() < 0.06 ? 1 : 0;
    rand[i * 4 + 3] = 0.42 + l * 0.58;
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(target, 3)); // used for bounds only
  geo.setAttribute("aTarget", new BufferAttribute(target, 3));
  geo.setAttribute("aScatter", new BufferAttribute(scatter, 3));
  geo.setAttribute("aRand", new BufferAttribute(rand, 4));

  const css = getComputedStyle(document.documentElement);
  const col = (v: string, f: string) => new Color(css.getPropertyValue(v).trim() || f);
  const uniforms = {
    uTime: { value: 0 },
    uAssemble: { value: 0 },
    uBurst: { value: 0 },
    uScatter: { value: 0 },
    uSize: { value: small ? 34 : 30 },
    uPixelRatio: { value: dpr },
    uMouse: { value: new Vector2(99, 99) },
    uMouseStrength: { value: 0 },
    uSignal: { value: col("--signal", "#35E0E8") },
    uEmber: { value: col("--ember", "#FF8A3D") },
    uBone: { value: col("--bone", "#EDEBE6") },
  };
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(geo, material);
  points.frustumCulled = false;
  group.add(points);

  // Layout: portrait sits to the right on wide screens, centred on narrow ones.
  const layout = () => {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    const visW = visH * camera.aspect;
    const wide = camera.aspect > 1.05;
    const s = wide ? 1 : Math.min(1, (visW * 0.95) / (HEIGHT * sampled.aspect));
    group.scale.setScalar(s);
    group.position.set(wide ? visW * 0.2 : 0, wide ? 0.05 : visH * 0.1, 0);
  };
  layout();
  const ro = new ResizeObserver(layout);
  ro.observe(container);

  // Pointer → plane z=0 in the group's space
  const ray = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const hit = new Vector3();
  const ndc = new Vector2();
  const mouseTarget = new Vector2(99, 99);
  let strengthTarget = 0;
  const onMove = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) {
      group.worldToLocal(hit);
      mouseTarget.set(hit.x, hit.y);
      strengthTarget = 1;
    }
  };
  const onLeave = () => (strengthTarget = 0);
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  // Intro: burst outward, then slowly assemble into the portrait.
  const intro = () => {
    canvas.style.opacity = "1";
    gsap.timeline()
      .to(uniforms.uBurst, { value: 1, duration: 1.4, ease: "expo.out" })
      .to(uniforms.uAssemble, { value: 1, duration: 3.4, ease: "power2.inOut" }, 0.5);
  };
  const offIntro = bus.has("intro:done") ? (intro(), () => {}) : bus.on("intro:done", intro);

  // Back to top: dissolve a little and re-form.
  const offRe = bus.on("particles:reassemble", () => {
    gsap.timeline()
      .to(uniforms.uAssemble, { value: 0.15, duration: 0.6, ease: "power2.out" })
      .to(uniforms.uAssemble, { value: 1, duration: 2.6, ease: "power2.inOut" });
  });

  // Scroll: scatter as the hero leaves.
  const st = ScrollTrigger.create({
    trigger: opts.trigger,
    start: "top top",
    end: "bottom top",
    scrub: true,
    onUpdate: (self) => (uniforms.uScatter.value = self.progress),
  });

  // Render only while visible.
  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(container);

  let last = performance.now();
  let raf = 0;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    uniforms.uTime.value += dt;
    uniforms.uMouse.value.lerp(mouseTarget, 0.12);
    uniforms.uMouseStrength.value += (strengthTarget - uniforms.uMouseStrength.value) * 0.06;
    group.rotation.y += ((ndc.x * 0.12) - group.rotation.y) * 0.04;
    group.rotation.x += ((-ndc.y * 0.06) - group.rotation.x) * 0.04;
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);
  opts.onReady?.();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      offIntro();
      offRe();
      st.kill();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      geo.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
