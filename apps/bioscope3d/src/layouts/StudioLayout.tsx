import { Topbar } from "@components/topbar/Topbar";
import { SidebarLeft } from "@components/sidebar-left/SidebarLeft";
import { SidebarRight } from "@components/sidebar-right/SidebarRight";
import { CanvasHead } from "@components/canvas-head/CanvasHead";
import { Stage } from "@components/stage/Stage";
import { MicroscopePanel } from "@components/bottom/MicroscopePanel";
import { ComparePanel } from "@components/bottom/ComparePanel";

export function StudioLayout() {
  return (
    <div className="app">
      <Topbar />
      <SidebarLeft />
      <main className="main">
        <CanvasHead />
        <Stage />
        <div className="bottom-cards">
          <MicroscopePanel />
          <ComparePanel />
        </div>
      </main>
      <SidebarRight />
    </div>
  );
}
