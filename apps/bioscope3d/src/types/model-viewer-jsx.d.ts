import type { DetailedHTMLProps, HTMLAttributes } from "react";

export type ModelViewerElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & {
    src?: string;
    alt?: string;
    "camera-controls"?: boolean;
    "camera-orbit"?: string;
    "camera-target"?: string;
    "field-of-view"?: string;
    "tone-mapping"?: string;
    "shadow-intensity"?: string | number;
    "auto-rotate"?: boolean;
    "interaction-prompt"?: string;
  },
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerElementProps;
    }
  }
}
