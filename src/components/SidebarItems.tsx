import { IconCalculator, IconSearch } from "@tabler/icons-react";
import Link from "next/link";

export const itemsList = [
  {
    title: "Wyszukiwarka Sądów",
    icon: <IconSearch />,
    link: "/wyszukuwarka-sadow",
  },
  {
    title: "Kalkulator rekompensaty",
    icon: <IconCalculator />,
    link: "/kalkulator-rekompensaty",
  },
];

const style = {
  inactive: "text-gray-400",
  active: "font-medium",
  link: "btn btn-ghost flex items-center justify-start p-3 text-sm w-full",
};

export function SidebarItems() {
  return (
    <ul className="md:pl-6">
      {itemsList.map((item) => (
        <li key={item.title}>
          <Link href={item.link}>
            <button className={style.link}>
              {item.icon}
              {item.title}
            </button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
