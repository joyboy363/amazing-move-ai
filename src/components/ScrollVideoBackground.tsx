import { useEffect, useRef } from "react";

const TOTAL_FRAMES = 300;
const pad = (n: number) => String(n).padStart(3, "0");
const frameSrc = (n: number) => `/frames/ezgif-frame-${pad(n)}.jpg`;

export const ScrollVideoBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const loadedFlags = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const currentIndex = useRef(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = () => { loadedFlags.current[i] = true; };
      img.src = frameSrc(i + 1);
      images.current[i] = img;
    }

    const draw = () => {
      const idx = currentIndex.current;
      let drawIdx = idx;
      for (let back = 0; back <= idx; back++) {
        if (loadedFlags.current[idx - back]) { drawIdx = idx - back; break; }
      }
      const img = images.current[drawIdx];
      if (img && loadedFlags.current[drawIdx]) {
        const { width: cw, height: ch } = canvas;
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const scale = Math.max(cw / iw, ch / ih);
        const dx = (cw - iw * scale) / 2;
        const dy = (ch - ih * scale) / 2;
        ctx.drawImage(img, dx, dy, iw * scale, ih * scale);
      }
      rafId.current = requestAnimationFrame(draw);
    };
    draw();

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      currentIndex.current = Math.min(
        Math.floor(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
      }}
    />
  );
};
