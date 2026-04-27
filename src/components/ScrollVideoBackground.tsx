import { useEffect } from "react";

const TOTAL_FRAMES = 300;
const pad = (n: number) => String(n).padStart(3, "0");
const frameSrc = (n: number) => `/frames/ezgif-frame-${pad(n)}.jpg`;

export const ScrollVideoBackground = () => {
  useEffect(() => {
    // Set initial body background
    document.body.style.backgroundImage =
      "linear-gradient(135deg, #0f1b2d 0%, #1a2a4a 50%, #0d1929 100%)";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";

    // Preload all frames
    const images: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(TOTAL_FRAMES).fill(false);
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = () => { loaded[i] = true; };
      img.src = frameSrc(i + 1);
      images[i] = img;
    }

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const idx = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

      // Find nearest loaded frame
      for (let back = 0; back <= idx; back++) {
        const i = idx - back;
        if (loaded[i]) {
          document.body.style.backgroundImage = `url(${images[i].src})`;
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.backgroundPosition = "";
    };
  }, []);

  return null;
};
