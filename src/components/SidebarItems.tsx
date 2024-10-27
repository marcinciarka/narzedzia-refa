import { IconCalculator, IconSearch } from "@tabler/icons-react";
import Link from "next/link";

export const itemsList = [
  {
    title: "Wyszukiwarka Sądów",
    icon: <IconSearch />,
    link: "/wyszukuwarka-sadow",
  },
  {
    title: "Kalkulator czegostam",
    icon: <IconCalculator />,
    link: "/kalkulator",
  },
];

const style = {
  inactive: "text-gray-400",
  active: "font-medium text-white",
  link: "flex items-center justify-start p-3 text-sm w-full hover:text-white",
};

export function SidebarItems() {
  return (
    <ul className="md:pl-6">
      {itemsList.map((item) => (
        <li key={item.title}>
          <Link href={item.link}>
            <span className={style.link}>
              <span>{item.icon}</span>
              <span className="mx-4">{item.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
