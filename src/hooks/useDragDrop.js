import { useState, useCallback, useRef, useEffect } from "react";

export function useDragDrop({ setShipments }) {
  const [dragStatus, setDragStatus] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const dragRef = useRef({ id: null, ghost: null, started: false, startX: 0, startY: 0 });
  const suppressClickRef = useRef(false);

  const findStageFromPoint = useCallback((x, y) => {
    const els = document.elementsFromPoint(x, y);
    for (const el of els) {
      const stage = el.getAttribute("data-stage");
      if (stage) return stage;
    }
    return null;
  }, []);

  const cleanupDrag = useCallback(() => {
    const d = dragRef.current;
    if (d.ghost) { d.ghost.remove(); d.ghost = null; }
    d.id = null;
    d.started = false;
    setDragStatus(null);
    setDropTarget(null);
  }, []);

  useEffect(() => {
    const DRAG_THRESHOLD = 5;

    const onMouseMove = (e) => {
      const d = dragRef.current;
      if (!d.id) return;

      if (!d.started) {
        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        d.started = true;
        suppressClickRef.current = true;
        setDragStatus(d.id);

        const ghost = document.createElement("div");
        ghost.textContent = d.id;
        Object.assign(ghost.style, {
          position: "fixed", zIndex: "9999", pointerEvents: "none",
          padding: "6px 12px", borderRadius: "8px",
          background: "#0F172A", color: "#F8FAFC",
          fontSize: "11px", fontWeight: "700",
          boxShadow: "0 8px 20px rgba(2,6,23,0.35)",
          transform: "translate(-50%, -50%)",
          left: e.clientX + "px", top: e.clientY + "px",
        });
        document.body.appendChild(ghost);
        d.ghost = ghost;
      }

      if (d.ghost) {
        d.ghost.style.left = e.clientX + "px";
        d.ghost.style.top = e.clientY + "px";
      }

      const stage = findStageFromPoint(e.clientX, e.clientY);
      setDropTarget(prev => (prev === stage ? prev : stage));
    };

    const onMouseUp = (e) => {
      const d = dragRef.current;
      if (!d.id) return;

      if (d.started) {
        const stage = findStageFromPoint(e.clientX, e.clientY);
        if (stage && d.id) {
          const idCopy = d.id;
          const stageCopy = stage;
          cleanupDrag();
          setShipments(prev => prev.map(s => s.id === idCopy ? { ...s, status: stageCopy } : s));
        } else {
          cleanupDrag();
        }
        setTimeout(() => { suppressClickRef.current = false; }, 0);
      } else {
        cleanupDrag();
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [findStageFromPoint, cleanupDrag, setShipments]);

  const handleHandleMouseDown = useCallback((e, shipment) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { id: shipment.id, ghost: null, started: false, startX: e.clientX, startY: e.clientY };
  }, []);

  return { dragStatus, dropTarget, handleHandleMouseDown, suppressClickRef };
}
