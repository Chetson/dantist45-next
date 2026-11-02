"use client";

import { useEffect, useRef } from "react";

/** Детерминированный генератор: у каждого филиала своя, но всегда одинаковая схема. */
function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Серая схема района на canvas с меткой в центре — в духе карты из макета.
 * Это не реальная карта: улицы генерируются по названию филиала, точный
 * маршрут — по ссылкам «Яндекс Карты» / «2ГИС» рядом.
 */
export function MapCanvas({ seed, className = "" }: { seed: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const g = canvas.getContext("2d");
      if (!g) return;
      g.scale(dpr, dpr);
      const rand = rng(seed);

      g.fillStyle = "#e9edf3";
      g.fillRect(0, 0, w, h);

      // кварталы
      const cols = Math.ceil(w / 70) + 2;
      const rows = Math.ceil(h / 56) + 2;
      const xs = Array.from({ length: cols }, (_, i) => i * 70 - 40 + rand() * 24);
      const ys = Array.from({ length: rows }, (_, i) => i * 56 - 30 + rand() * 20);
      const tilt = (rand() - 0.5) * 0.35;
      g.save();
      g.translate(w / 2, h / 2);
      g.rotate(tilt);
      g.translate(-w / 2, -h / 2);

      for (let i = 0; i < xs.length - 1; i++) {
        for (let j = 0; j < ys.length - 1; j++) {
          const park = rand() < 0.1;
          g.fillStyle = park ? "#dbe5de" : rand() < 0.5 ? "#f4f6f9" : "#eef1f6";
          g.beginPath();
          g.roundRect(xs[i] + 5, ys[j] + 5, xs[i + 1] - xs[i] - 10, ys[j + 1] - ys[j] - 10, 6);
          g.fill();
        }
      }

      // река
      g.strokeStyle = "#d3e0ee";
      g.lineWidth = 16;
      g.lineCap = "round";
      g.beginPath();
      const ry = h * (0.25 + rand() * 0.5);
      g.moveTo(-40, ry + 30);
      g.bezierCurveTo(w * 0.3, ry - 50, w * 0.6, ry + 70, w + 40, ry - 20);
      g.stroke();

      // магистраль
      g.strokeStyle = "#ffffff";
      g.lineWidth = 8;
      g.beginPath();
      g.moveTo(-40, h * rand());
      g.lineTo(w + 40, h * rand());
      g.stroke();
      g.restore();

      // метка
      const cx = w / 2;
      const cy = h / 2 + 10;
      g.fillStyle = "rgba(59,73,93,0.18)";
      g.beginPath();
      g.ellipse(cx, cy + 22, 14, 4.5, 0, 0, Math.PI * 2);
      g.fill();
      const grad = g.createLinearGradient(cx - 18, cy - 50, cx + 18, cy + 20);
      grad.addColorStop(0, "#a4aee6");
      grad.addColorStop(1, "#6b76bf");
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(cx, cy + 22);
      g.bezierCurveTo(cx - 30, cy - 12, cx - 20, cy - 52, cx, cy - 52);
      g.bezierCurveTo(cx + 20, cy - 52, cx + 30, cy - 12, cx, cy + 22);
      g.fill();
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(cx, cy - 28, 8, 0, Math.PI * 2);
      g.fill();
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [seed]);

  return <canvas ref={ref} aria-hidden="true" className={`bg-[#e9edf3] ${className}`} />;
}
