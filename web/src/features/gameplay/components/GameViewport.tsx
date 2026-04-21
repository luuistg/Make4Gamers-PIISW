import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  src: string;
  title: string;
  ratio?: string; // ej: "16:9", "4:3", "9:16"
  className?: string;
};

function parseRatio(input: string): number {
  const [w, h] = input.split(":").map(Number);
  if (!w || !h) return 16 / 9;
  return w / h;
}

export default function GameViewport({
  src,
  title,
  ratio = "4:3",
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const targetRatio = useMemo(() => parseRatio(ratio), [ratio]);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    });

    ro.observe(el);
    const rect = el.getBoundingClientRect();
    setSize({ w: rect.width, h: rect.height });

    return () => ro.disconnect();
  }, []);

  const frameSize = useMemo(() => {
    const { w, h } = size;
    if (!w || !h) return { w: 0, h: 0 };

    const containerRatio = w / h;
    if (containerRatio > targetRatio) {
      // sobran lados -> bandas verticales
      return { w: h * targetRatio, h };
    }
    // sobra arriba/abajo -> bandas horizontales
    return { w, h: w / targetRatio };
  }, [size, targetRatio]);

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}