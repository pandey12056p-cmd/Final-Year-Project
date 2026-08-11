"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  icon: string;
  title: string;
};

export default function MenuItem({
  href,
  icon,
  title,
}: Props) {
  const pathname = usePathname();

  const active =
    pathname === href ||
    pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
      ${
        active
          ? "bg-blue-700 text-white shadow-lg"
          : "text-gray-600 hover:bg-slate-100"
      }`}
    >
      <span className="text-2xl">
        {icon}
      </span>

      <span className="font-semibold text-lg">
        {title}
      </span>
    </Link>
  );
}