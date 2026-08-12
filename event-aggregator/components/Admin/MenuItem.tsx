"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  href: string;
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
};

export default function MenuItem({
  href,
  icon,
  title,
  onClick,
}: Props) {
  const pathname = usePathname();

  const active =
    pathname === href ||
    pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer
      ${
        active
          ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={`w-5 h-5 flex items-center justify-center transition-colors ${active ? "text-blue-700" : "text-slate-400 group-hover:text-slate-600"}`}>
        {icon}
      </span>

      <span>
        {title}
      </span>
    </Link>
  );
}