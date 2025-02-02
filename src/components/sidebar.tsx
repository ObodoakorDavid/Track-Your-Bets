"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, Activity, PanelLeftClose, PanelLeftOpen } from "lucide-react";
const links = [
  { href: "/dashboard", label: "Home", icon: <Home className="w-4" /> },
  {
    href: "/dashboard/bets",
    label: "Bets",
    icon: <Activity className="w-4" />,
  },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 min-h-full bg-background text-black border-r-2 border-gray-300 transition-transform duration-300 ${
        isCollapsed
          ? " -translate-x-16 w-16 md:relative md:w-0"
          : "translate-x-0 w-32 md:relative md:w-36"
      }  `}
    >
      <div className="p-4 flex flex-col h-full relative">
        {/* Toggle Button */}
        <button
          className={`absolute w-12 h-12 p-0 top-4 -right-5 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md transition-all duration-300 ${
            isCollapsed
              ? "-translate-x-[24px] -right-[48px] md:-right-[78px]"
              : "-translate-x-[24px] md:transalate-x-[180px] -right-[44px]"
          }`}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-6 h-6" />
          ) : (
            <PanelLeftClose className="w-6 h-6" />
          )}
        </button>

        <nav className="flex flex-col mt-12">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 font-semibold hover:bg-gray-100 px-2 py-2 rounded"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {link.icon}
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
