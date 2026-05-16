import { useLayoutEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { CELL_ORDER } from "@data/cells";
import type { CellId } from "@/types";
import { CellModelViewer } from "./CellModelViewer";

/** Studio carousel: horizontal slide + light scale/opacity (no filters — WebGL-safe). */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_OUT_SOFT = [0.33, 1, 0.68, 1] as const;

export function CellStageSlide({
  activeCell,
  src,
}: {
  activeCell: CellId;
  src: string;
}) {
  const reduceMotion = useReducedMotion();
  const prevCellRef = useRef(activeCell);
  const skipInitialEnter = useRef(true);
  const from = CELL_ORDER.indexOf(prevCellRef.current);
  const to = CELL_ORDER.indexOf(activeCell);
  const direction = to >= from ? 1 : -1;

  useLayoutEffect(() => {
    prevCellRef.current = activeCell;
    skipInitialEnter.current = false;
  }, [activeCell]);

  const transition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : {
        duration: 0.48,
        ease: EASE_OUT,
        opacity: { duration: 0.38, ease: EASE_OUT_SOFT },
        scale: { duration: 0.52, ease: EASE_OUT },
      };

  const variants = reduceMotion
    ? {
        enter: { x: 0, opacity: 0, scale: 1, zIndex: 2 },
        center: { x: 0, opacity: 1, scale: 1, zIndex: 2 },
        exit: { x: 0, opacity: 0, scale: 1, zIndex: 1 },
      }
    : {
        enter: (dir: number) => ({
          x: dir >= 0 ? "100%" : "-100%",
          opacity: 0,
          scale: 0.986,
          zIndex: 2,
        }),
        center: { x: 0, opacity: 1, scale: 1, zIndex: 2 },
        exit: (dir: number) => ({
          x: dir >= 0 ? "-100%" : "100%",
          opacity: 0,
          scale: 0.982,
          zIndex: 1,
        }),
      };

  return (
    <div className="stage-model-slide-host">
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <motion.div
          key={activeCell}
          className="stage-model-slide-pane"
          role="presentation"
          custom={direction}
          variants={variants}
          initial={skipInitialEnter.current ? false : "enter"}
          animate="center"
          exit="exit"
          transition={transition}
        >
          <CellModelViewer cellId={activeCell} src={src} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
