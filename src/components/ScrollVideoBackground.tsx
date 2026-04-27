import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 300;
const pad = (n: number) => String(n).padStart(3, "0");
const frameSrc = (n: number) => `/frames/ezgif-frame-${pad(n)}.jpg`;

export const ScrollVideoBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const loadedFlags = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const currentIndex = useRef(0);
  const rafId = useRef<number>();
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Load frame 1 first, then the rest
    const loadFrame = (i: number) => {
      const img = new Image();
      img.onload = () => {
        loadedFlags.current[i] = true;
        if (i === 0) setFirstFrameLoaded(true);
      };
      img.src = frameSrc(i + 1);
      images.current[i] = img;
    };

    loadFrame(0);
    for (let i = 1; i < TOTAL_FRAMES; i++) loadFrame(i);

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
    <>
      {/* Fallback gradient shown until first frame loads */}
      {!firstFrameLoaded && (
        <div
          className="fixed inset-0"
          style={{
            zIndex: 0,
            background: "linear-gradient(135deg, #0f1b2d 0%, #1a2a4a 50%, #0d1929 100%)",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0, opacity: firstFrameLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      />
    </>
  );
};
