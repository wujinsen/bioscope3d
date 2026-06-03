import { useLayoutEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import type { CellId } from "@/types";
import { CellModelViewer } from "./CellModelViewer";

/** Studio carousel: opacity cross-fade only (transform breaks WebGL in `<model-viewer>`). */
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

  useLayoutEffect(() => {
    prevCellRef.current = activeCell;
    skipInitialEnter.current = false;
  }, [activeCell]);

  const transition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { duration: 0.38, ease: EASE_OUT, opacity: { duration: 0.32, ease: EASE_OUT_SOFT } };

  /* Opacity-only transitions: CSS transform on this pane breaks WebGL in `<model-viewer>`. */
  const variants = {
    enter: { opacity: 0, zIndex: 2 },
    center: { opacity: 1, zIndex: 2 },
    exit: { opacity: 0, zIndex: 1 },
  };

  return (
    <div className="stage-model-slide-host">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activeCell}
          className="stage-model-slide-pane"
          role="presentation"
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
