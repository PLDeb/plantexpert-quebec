"use client";

import { useEffect, useRef } from "react";
import { plantByName } from "@/lib/plants";
import { COLORS } from "@/lib/colors";
import type { GeneratedGuild } from "@/types/guild";

const DIRS: Record<string, { dx: number; dy: number }> = {
  N: { dx: 0, dy: -1 },
  "N-E": { dx: 0.7, dy: -0.7 },
  E: { dx: 1, dy: 0 },
  "S-E": { dx: 0.7, dy: 0.7 },
  S: { dx: 0, dy: 1 },
  "S-O": { dx: -0.7, dy: 0.7 },
  O: { dx: -1, dy: 0 },
  "N-O": { dx: -0.7, dy: -0.7 },
};

export default function GuildCanvas({
  guild,
  superficie = 500,
}: {
  guild: GeneratedGuild | null;
  superficie?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!guild?.plantes || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
    bg.addColorStop(0, "#E8F5E9");
    bg.addColorStop(1, "#C8E6C9");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#A5D6A7";
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx < W; gx += 36) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    for (let gy = 0; gy < H; gy += 36) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }

    const sun = ctx.createLinearGradient(0, H * 0.65, 0, H);
    sun.addColorStop(0, "rgba(255,220,50,0)");
    sun.addColorStop(1, "rgba(255,220,50,0.15)");
    ctx.fillStyle = sun;
    ctx.fillRect(0, H * 0.65, W, H * 0.35);

    ctx.font = "bold 11px monospace";
    ctx.fillStyle = "#2D5A3D";
    ctx.textAlign = "center";
    ctx.fillText("N ↑", W / 2, 15);
    ctx.fillText("S ↓", W / 2, H - 5);
    ctx.fillText("O", 12, H / 2);
    ctx.fillText("E", W - 12, H / 2);

    const scale = (Math.min(W, H) * 0.65) / Math.sqrt(superficie);
    const cx = W / 2;
    const cy = H / 2;

    guild.plantes.forEach((gp, pi) => {
      const plant = plantByName(gp.nom);
      if (!plant) return;

      let dir = DIRS[gp.orientation || plant.orientation_preferee];
      if (!dir) {
        const angle = (pi * Math.PI * 2) / guild.plantes.length;
        dir = { dx: Math.cos(angle), dy: Math.sin(angle) };
      }

      const spread = (gp.distance || (pi + 1) * 0.7) * scale;
      const px = cx + dir.dx * spread;
      const py = cy + dir.dy * spread;
      const r = Math.max(14, Math.min(40, (plant.hauteur[1] / 20) * 40));

      ctx.beginPath();
      ctx.ellipse(px + 4, py + 5, r * 1.3, r * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fill();

      const cg = ctx.createRadialGradient(px - r * 0.3, py - r * 0.3, 0, px, py, r);
      cg.addColorStop(0, `${plant.couleur}EE`);
      cg.addColorStop(1, `${plant.couleur}88`);
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();
      ctx.strokeStyle = plant.couleur;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = `${Math.max(14, r * 0.75)}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(plant.emoji, px, py);

      ctx.font = "bold 9px sans-serif";
      ctx.textBaseline = "top";
      const lbl = gp.nom.split(" ")[0];
      const tw = ctx.measureText(lbl).width;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(px - tw / 2 - 2, py + r + 2, tw + 4, 12);
      ctx.fillStyle = "#1A3A2A";
      ctx.fillText(lbl, px, py + r + 3);
      if (gp.quantite > 1) {
        ctx.font = "8px monospace";
        ctx.fillStyle = "#8B6B4A";
        ctx.fillText(`x${gp.quantite}`, px, py + r + 15);
      }
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.bark;
    ctx.fill();
    ctx.font = "9px sans-serif";
    ctx.fillStyle = COLORS.bark;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("centre", cx, cy + 7);
  }, [guild, superficie]);

  return (
    <canvas
      ref={ref}
      width={440}
      height={360}
      className="block w-full rounded-xl border-2 border-mist"
    />
  );
}
