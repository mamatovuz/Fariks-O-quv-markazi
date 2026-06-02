import { useEffect, useRef, useState } from "react";

const firstShowDelay = 5_000;
const reopenDelay = 120_000;
const ozodFlowUrl = "https://t.me/OzodFlow";
const oldPositionKey = "ozodflow-badge-position";
const anchoredStyle = {
  right: "calc(clamp(12px, 3vw, 18px) + env(safe-area-inset-right))",
  bottom: "calc(clamp(12px, 3vw, 18px) + env(safe-area-inset-bottom))",
};

function getEdgeGap() {
  return Math.min(Math.max(window.innerWidth * 0.03, 12), 18);
}

function clampPosition(position, element) {
  const width = element?.offsetWidth || 116;
  const height = element?.offsetHeight || 30;
  const gap = getEdgeGap();

  return {
    x: Math.min(Math.max(gap, position.x), window.innerWidth - width - gap),
    y: Math.min(Math.max(gap, position.y), window.innerHeight - height - gap),
  };
}

export function OzodFlowBadge() {
  const badgeRef = useRef(null);
  const dragRef = useRef(null);
  const frameRef = useRef(null);
  const nextPositionRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [closedCount, setClosedCount] = useState(0);
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.removeItem(oldPositionKey);
    } catch {
      // localStorage can be unavailable in restricted browsers.
    }
  }, []);

  useEffect(() => {
    if (visible) return void 0;

    const delay = closedCount === 0 ? firstShowDelay : reopenDelay;
    const timer = window.setTimeout(() => {
      setPosition(null);
      setVisible(true);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [closedCount, visible]);

  useEffect(() => {
    function handleResize() {
      if (dragRef.current) return;
      setPosition(null);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function schedulePosition(next) {
    nextPositionRef.current = next;
    if (frameRef.current) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      setPosition(nextPositionRef.current);
    });
  }

  function handlePointerDown(event) {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    const rect = badgeRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    };
    setIsDragging(true);
    setPosition({ x: rect.left, y: rect.top });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.moved && Math.hypot(dx, dy) > 4) {
      drag.moved = true;
    }

    if (drag.moved) event.preventDefault();

    schedulePosition(
      clampPosition(
        {
          x: drag.originX + dx,
          y: drag.originY + dy,
        },
        badgeRef.current,
      ),
    );
  }

  function finishDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }

    if (!drag.moved) {
      setPosition(null);
      return;
    }

    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 160);
  }

  if (!visible) return null;

  return (
    <div
      ref={badgeRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      style={position ? { left: position.x, top: position.y } : anchoredStyle}
      className={`fixed z-[80] flex touch-none select-none items-center overflow-hidden rounded bg-ink text-paper shadow-lg ring-1 ring-paper/10 ${
        isDragging ? "cursor-grabbing shadow-2xl" : "cursor-grab"
      }`}
    >
      <a
        href={ozodFlowUrl}
        target="_blank"
        rel="noreferrer"
        draggable="false"
        onClick={(event) => {
          if (suppressClickRef.current) event.preventDefault();
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-ink/90"
      >
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
        <span>OzodFlow</span>
      </a>
      <button
        type="button"
        aria-label="OzodFlow oynasini yopish"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => {
          setVisible(false);
          setPosition(null);
          setClosedCount((count) => count + 1);
        }}
        className="flex h-7 w-7 items-center justify-center border-l border-paper/10 text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
      >
        <span aria-hidden>&times;</span>
      </button>
    </div>
  );
}
