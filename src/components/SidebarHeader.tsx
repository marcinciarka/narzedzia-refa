import {
  IconCalculator,
  IconGavel,
  IconSearch,
  IconTool,
} from "@tabler/icons-react";
import Link from "next/link";

export function SidebarHeader() {
  return (
    <div className="mt-24 mb-12 flex flex-col text-center items-center justify-center bg-slate-700">
      <Link href="/">
        <h1 className="text-white text-3xl font-bold mb-12 relative group">
          Narzędzia
          <br />
          Referendarza
          <p className="text-xs block absolute w-[100%] text-center opacity-0 bottom-[0] group-hover:bottom-[-20px] group-hover:opacity-100 transition-all">
            powrót do strony głównej
          </p>
        </h1>
      </Link>
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
