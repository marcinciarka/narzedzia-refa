import {
  IconCalculator,
  IconGavel,
  IconSearch,
  IconTool,
} from "@tabler/icons-react";

export function SidebarHeader() {
  return (
    <div className="mt-24 mb-12 flex flex-col text-center items-center justify-center bg-slate-700">
      <h1 className="text-white text-3xl font-bold mb-12">
        Narzędzia
        <br />
        Referendarza
      </h1>
      <div className="bg-slate-600 h-[1px] w-[90%] rounded-full mb-6" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <IconTool />
        <IconCalculator />
        <IconGavel />
        <IconSearch />
      </div>
      <div className="bg-slate-600 h-[1px] w-[90%] rounded-full" />
    </div>
  );
}
