"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type * as THREE from "three";

export type SceneModel = "tooth" | "binder" | "bottle";

/**
 * Трёхмерный предмет на canvas (three.js): глянцевый материал, мягкое студийное
 * освещение, лёгкое «парение» и наклон за курсором. Библиотека подгружается
 * отдельным чанком уже после отрисовки страницы; пока она грузится (и если
 * WebGL недоступен) виден `fallback`. Анимация стоит на паузе вне экрана
 * и отключается при `prefers-reduced-motion`.
 */
export function Scene3D({
  model,
  className = "",
  fallback,
}: {
  model: SceneModel;
  className?: string;
  fallback?: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    // Скрытая через CSS сцена (display: none) не рисуется и three.js не грузит.
    if (!el || el.offsetParent === null) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const [T, { RoomEnvironment }, { RoundedBoxGeometry }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
          import("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
        ]);
        if (disposed) return;

        const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.domElement.className = "absolute inset-0 size-full";
        el.appendChild(renderer.domElement);

        const scene = new T.Scene();
        const pmrem = new T.PMREMGenerator(renderer);
        const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envMap;

        const camera = new T.PerspectiveCamera(28, 1, 0.1, 50);
        camera.position.set(0, 0, 11);

        const key = new T.DirectionalLight(0xffffff, 1.6);
        key.position.set(-3, 5, 6);
        scene.add(key);
        const rim = new T.DirectionalLight(0xbcd3ff, 1.2);
        rim.position.set(5, 1, -4);
        scene.add(rim);

        const disposables: { dispose(): void }[] = [envMap];
        const track = <D extends { dispose(): void }>(d: D) => (disposables.push(d), d);

        const object =
          model === "tooth"
            ? buildTooth(T, track)
            : model === "bottle"
              ? buildBottle(T, track)
              : buildBinder(T, RoundedBoxGeometry, track);
        const pivot = new T.Group();
        pivot.add(object);
        scene.add(pivot);

        const resize = () => {
          const { clientWidth: w, clientHeight: h } = el;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        resize();

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const pointer = { x: 0, y: 0 };
        const onMove = (e: PointerEvent) => {
          pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
          pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        const base =
          model === "tooth"
            ? { x: 0.12, y: -0.5, z: -0.14 }
            : model === "bottle"
              ? { x: 0.1, y: 0.5, z: -0.12 }
              : { x: 0.18, y: -0.7, z: 0.1 };
        let raf = 0;
        let visible = true;
        const clock = new T.Clock();
        const frame = () => {
          const t = clock.getElapsedTime();
          pivot.rotation.set(
            base.x + (reduced ? 0 : pointer.y * 0.12 + Math.cos(t * 0.5) * 0.04),
            base.y + (reduced ? 0 : pointer.x * 0.35 + Math.sin(t * 0.45) * 0.18),
            base.z,
          );
          pivot.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.12;
          renderer.render(scene, camera);
          if (!reduced && visible) raf = requestAnimationFrame(frame);
        };
        frame();

        const io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          cancelAnimationFrame(raf);
          if (visible && !reduced) raf = requestAnimationFrame(frame);
        });
        io.observe(el);

        setReady(true);

        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          ro.disconnect();
          window.removeEventListener("pointermove", onMove);
          disposables.forEach((d) => d.dispose());
          pmrem.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
        if (disposed) cleanup();
      } catch {
        // WebGL недоступен — остаётся запасная иллюстрация.
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [model]);

  return (
    <div ref={host} aria-hidden="true" className={`pointer-events-none ${className}`}>
      {fallback && (
        <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}>
          {fallback}
        </div>
      )}
    </div>
  );
}

type Three = typeof THREE;
type Track = <D extends { dispose(): void }>(d: D) => D;

function centered(T: Three, group: THREE.Group, height: number) {
  const box = new T.Box3().setFromObject(group);
  const size = box.getSize(new T.Vector3());
  const center = box.getCenter(new T.Vector3());
  group.children.forEach((c) => c.position.sub(center));
  group.scale.setScalar(height / size.y);
  return group;
}

/** Зуб: жевательная коронка с буграми и два корня, глянцевая эмаль. */
function buildTooth(T: Three, track: Track) {
  const enamel = track(
    new T.MeshPhysicalMaterial({
      color: 0xf4f8ff,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      sheen: 0.4,
      sheenColor: new T.Color(0xcfe0ff),
    }),
  );
  const root = track(
    new T.MeshPhysicalMaterial({ color: 0xe6edf8, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
  );

  const crownGeo = track(new T.SphereGeometry(1, 96, 96));
  const pos = crownGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i) * 1.08;
    let y = pos.getY(i);
    let z = pos.getZ(i) * 1.0;
    const top = Math.max(0, y);
    y += top * 0.3 * Math.cos(x * 3.4) * Math.cos(z * 3.6); // бугры
    y *= 0.95;
    x *= 1 + 0.08 * Math.max(0, -y); // слегка сужается книзу
    z *= 1 + 0.06 * Math.max(0, -y);
    pos.setXYZ(i, x, y, z);
  }
  crownGeo.computeVertexNormals();
  const crown = new T.Mesh(crownGeo, enamel);

  const profile: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const k = i / 24;
    const r = 0.42 * Math.pow(1 - k, 0.8) + 0.04 * Math.sin(k * Math.PI);
    profile.push(new T.Vector2(Math.max(r, 0.001), -k * 1.5));
  }
  const rootGeo = track(new T.LatheGeometry(profile, 40));
  const rootL = new T.Mesh(rootGeo, root);
  rootL.position.set(-0.52, -0.62, 0);
  rootL.rotation.z = -0.09;
  const rootR = rootL.clone();
  rootR.position.x = 0.52;
  rootR.rotation.z = 0.09;

  const group = new T.Group();
  group.add(crown, rootL, rootR);
  return centered(T, group, 3.4);
}

/** Тетрадь «план лечения»: лавандовая папка на кольцах с листом бумаги. */
function buildBinder(
  T: Three,
  RoundedBoxGeometry: typeof import("three/examples/jsm/geometries/RoundedBoxGeometry.js").RoundedBoxGeometry,
  track: Track,
) {
  const cover = track(
    new T.MeshPhysicalMaterial({ color: 0x8590d6, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.25 }),
  );
  const paper = track(new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
  const steel = track(new T.MeshStandardMaterial({ color: 0xe8eef8, metalness: 1, roughness: 0.22 }));

  const W = 2.3;
  const H = 3.1;
  const group = new T.Group();

  const back = new T.Mesh(track(new RoundedBoxGeometry(W + 0.35, H + 0.3, 0.14, 6, 0.06)), cover);
  back.position.set(0.1, 0, -0.2);
  group.add(back);

  const stack = new T.Mesh(track(new RoundedBoxGeometry(W, H, 0.22, 4, 0.03)), paper);
  group.add(stack);

  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 860;
  const g = canvas.getContext("2d")!;
  g.fillStyle = "#fff";
  g.fillRect(0, 0, 640, 860);
  g.fillStyle = "#3b495d";
  g.font = "800 58px Manrope, Arial, sans-serif";
  g.fillText("план лечения", 70, 150);
  g.fillStyle = "#c9d6ea";
  g.fillRect(70, 190, 500, 4);
  for (let i = 0; i < 12; i++) {
    g.fillStyle = i % 4 === 0 ? "#8a95d2" : "#dbe5f3";
    g.fillRect(70, 250 + i * 46, i % 3 === 2 ? 320 : 500, 14);
  }
  const tex = track(new T.CanvasTexture(canvas));
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 4;
  const sheet = new T.Mesh(track(new T.PlaneGeometry(W - 0.04, H - 0.04)), new T.MeshStandardMaterial({ map: tex, roughness: 0.85 }));
  track(sheet.material as THREE.Material);
  sheet.position.z = 0.115;
  group.add(sheet);

  const ringGeo = track(new T.TorusGeometry(0.2, 0.045, 24, 48));
  [-1, 0, 1].forEach((i) => {
    const ring = new T.Mesh(ringGeo, steel);
    ring.position.set(-W / 2 + 0.02, i * 0.95, 0.1);
    ring.rotation.y = Math.PI / 2;
    group.add(ring);
  });

  return centered(T, group, 3.4);
}

/** Флакон-спрей с антисептиком: полупрозрачное стекло, этикетка и распылитель. */
function buildBottle(T: Three, track: Track) {
  const glass = track(
    new T.MeshPhysicalMaterial({
      color: 0xdbeafc,
      roughness: 0.08,
      transparent: true,
      opacity: 0.55,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      side: T.DoubleSide,
    }),
  );
  const white = track(new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.35, clearcoat: 0.6 }));
  const lavender = track(new T.MeshPhysicalMaterial({ color: 0x8590d6, roughness: 0.3, clearcoat: 0.8 }));

  const body: THREE.Vector2[] = [
    new T.Vector2(0.001, 0),
    new T.Vector2(0.62, 0),
    new T.Vector2(0.72, 0.1),
    new T.Vector2(0.74, 0.3),
    new T.Vector2(0.74, 1.8),
    new T.Vector2(0.7, 2.05),
    new T.Vector2(0.45, 2.3),
    new T.Vector2(0.3, 2.45),
    new T.Vector2(0.3, 2.65),
    new T.Vector2(0.001, 2.65),
  ];
  const bottle = new T.Mesh(track(new T.LatheGeometry(body, 64)), glass);

  const liquid = new T.Mesh(
    track(new T.CylinderGeometry(0.64, 0.6, 1.5, 48)),
    track(new T.MeshPhysicalMaterial({ color: 0xa9cdf2, roughness: 0.1, transparent: true, opacity: 0.6 })),
  );
  liquid.position.y = 0.95;

  const label = new T.Mesh(
    track(new T.CylinderGeometry(0.755, 0.755, 0.95, 64, 1, true, -1.3, 2.6)),
    track(new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, side: T.DoubleSide })),
  );
  label.position.y = 1.05;
  const stripe = new T.Mesh(
    track(new T.CylinderGeometry(0.76, 0.76, 0.12, 64, 1, true, -1.3, 2.6)),
    track(new T.MeshStandardMaterial({ color: 0x7d88cb, roughness: 0.5, side: T.DoubleSide })),
  );
  stripe.position.y = 1.3;

  const collar = new T.Mesh(track(new T.CylinderGeometry(0.34, 0.34, 0.3, 40)), white);
  collar.position.y = 2.78;
  const stem = new T.Mesh(track(new T.CylinderGeometry(0.17, 0.2, 0.35, 32)), lavender);
  stem.position.y = 3.1;
  const head = new T.Mesh(track(new T.CylinderGeometry(0.3, 0.3, 0.3, 40)), lavender);
  head.position.y = 3.4;
  const nozzle = new T.Mesh(track(new T.CylinderGeometry(0.1, 0.13, 0.7, 24)), white);
  nozzle.rotation.z = Math.PI / 2;
  nozzle.position.set(0.5, 3.4, 0);

  const group = new T.Group();
  group.add(bottle, liquid, label, stripe, collar, stem, head, nozzle);
  return centered(T, group, 3.4);
}
