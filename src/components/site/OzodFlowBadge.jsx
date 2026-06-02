import { useEffect, useRef, useState } from "react";

const firstShowDelay = 5_000;
const reopenDelay = 120_000;
const ozodFlowUrl = "https://t.me/OzodFlow";
const positionKey = "ozodflow-badge-position";

function clampPosition(position, element) {
  const width = element?.offsetWidth || 106;
  const height = element?.offsetHeight || 30;

  return {
    x: Math.min(Math.max(8, position.x), window.innerWidth - width - 8),
    y: Math.min(Math.max(8, position.y), window.innerHeight - height - 8),
  };
}

function readSavedPosition() {
  try {
    const saved = window.localStorage.getItem(positionKey);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function savePosition(position) {
  try {
    window.localStorage.setItem(positionKey, JSON.stringify(position));
  } catch {
    // localStorage can be unavailable in restricted browsers.
  }
}

export function OzodFlowBadge() {
  const badgeRef = useRef(null);
  const dragRef = useRef(null);
  const lastPositionRef = useRef({ x: 16, y: 16 });
  const suppressClickRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [closedCount, setClosedCount] = useState(0);
  const [position, setPosition] = useState({ x: 16, y: 16 });

  useEffect(() => {
    const saved = readSavedPosition();
    const next = clampPosition(saved || { x: 16, y: window.innerHeight - 48 }, badgeRef.current);
    lastPositionRef.current = next;
    setPosition(next);
  }, []);

  useEffect(() => {
    if (visible) return void 0;

    const delay = closedCount === 0 ? firstShowDelay : reopenDelay;
    const timer = window.setTimeout(() => setVisible(true), delay);

    return () => window.clearTimeout(timer);
  }, [closedCount, visible]);

  useEffect(() => {
    function handleResize() {
      setPosition((current) => {
        const next = clampPosition(current, badgeRef.current);
        lastPositionRef.current = next;
        savePosition(next);
        return next;
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handlePointerDown(event) {
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      drag.moved = true;
    }

    const next = clampPosition(
      {
        x: drag.originX + dx,
        y: drag.originY + dy,
      },
      badgeRef.current,
    );
    lastPositionRef.current = next;
    setPosition(next);
  }

  function handlePointerUp(event) {
    const drag = dragRef.current;
    if (!drag) return;

    dragRef.current = null;
    savePosition(lastPositionRef.current);
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 150);
    }
  }

  if (!visible) return null;

  return (
    <div
      ref={badgeRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ left: position.x, top: position.y }}
      className="fixed z-[80] flex touch-none select-none items-center overflow-hidden rounded bg-ink text-paper shadow-lg ring-1 ring-paper/10 cursor-grab active:cursor-grabbing"
    >
      <a
        href={ozodFlowUrl}
        target="_blank"
        rel="noreferrer"
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
          setClosedCount((count) => count + 1);
        }}
        className="flex h-7 w-7 items-center justify-center border-l border-paper/10 text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
      >
        <span aria-hidden>&times;</span>
      </button>
    </div>
  );
}
