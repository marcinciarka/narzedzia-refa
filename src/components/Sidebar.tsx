import { SidebarHeader } from "@/components/SidebarHeader";
import { SidebarItems } from "@/components/SidebarItems";

interface SidebarProps {
  mobileOrientation: "start" | "end";
}

const style = {
  mobileOrientation: {
    start: "left-0 ",
    end: "right-0 lg:left-0",
  },
  container: "pb-32 lg:pb-12",
  open: "absolute w-8/12 z-40 sm:w-5/12",
  default:
    "bg-slate-700 h-screen overflow-y-auto top-0 lg:flex lg:relative lg:w-64 lg:z-auto",
};

export function Sidebar(props: SidebarProps) {
  return (
    <aside
      className={`${style.default} 
        ${style.mobileOrientation[props.mobileOrientation]} 
        ${style.open}`}
    >
      <div className={style.container}>
        <SidebarHeader />
        <SidebarItems />
      </div>
    </aside>
  );
}
