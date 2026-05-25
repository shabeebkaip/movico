"use client";

import { useRef, useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

interface Props {
  src: string;
  label?: string;
  desktopWidth?: number;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  onRefresh?: () => void;
}

export function ScaledPreviewPane({ src, label, desktopWidth = 1280, iframeRef: externalRef, onRefresh }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<HTMLIFrameElement>(null);
  const iframeRef = externalRef ?? internalRef;
  const [dims, setDims] = useState({ scale: 1, height: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ scale: width / desktopWidth, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [desktopWidth]);

  function refresh() {
    if (onRefresh) {
      onRefresh();
    } else if (iframeRef.current) {
      iframeRef.current.src = src;
    }
  }

  const { scale, height } = dims;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden border-l border-slate-200">
      {/* Toolbar */}
      <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        </div>
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1 text-[11px] text-slate-400 truncate">
          localhost:3000{src === "/" ? "" : src}
        </div>
        <span className="text-[9px] text-slate-400 font-mono shrink-0 tabular-nums">
          {desktopWidth}px · {Math.round(scale * 100)}%
        </span>
        <button onClick={refresh} className="text-slate-400 hover:text-slate-700 transition-colors shrink-0" title="Refresh preview">
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Scaled iframe */}
      <div ref={containerRef} className="flex-1 overflow-hidden relative bg-white">
        {scale > 0 && (
          <iframe
            ref={iframeRef}
            src={src}
            title={label ?? "Preview"}
            onLoad={(e) => {
              try {
                (e.target as HTMLIFrameElement).contentWindow?.scrollTo(0, 0);
              } catch {}
            }}
            style={{
              width: `${desktopWidth}px`,
              height: `${height / scale}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: "none",
              display: "block",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
