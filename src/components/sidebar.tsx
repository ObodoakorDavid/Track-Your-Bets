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
  // {
  //   href: "/dashboard/analytics",
  //   label: "Analytics",
  //   icon: <BarChart className="w-4" />,
  // },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-48"
      } bg-background text-black border-r-2 border-gray-300 transition-all duration-300`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Toggle Button */}
        <button
          className="self-end mb-4"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-6 h-6" />
          ) : (
            <PanelLeftClose className="w-6 h-6" />
          )}
        </button>

        {/* <h1
          className={`text-2xl font-bold mb-6 ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          Track It
        </h1> */}

        <nav className="flex flex-col">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 font-font-semibold hover:bg-gray-100 px-2 py-2 rounded"
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
