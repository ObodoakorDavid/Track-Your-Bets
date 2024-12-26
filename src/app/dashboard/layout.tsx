import React from "react";
import Sidebar from "@/components/sidebar";
import Dropdown from "@/components/Dropdown";
import { cookies } from "next/headers";
import { Bell } from "lucide-react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await fetch(`${API_BASE_URL}/api/user`, {
    headers: {
      Cookie: `token=${token};`,
    },
    cache: "no-store", // Disable caching for dynamic data
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data.user;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between bg-background text-black border-b-2 border-gray-300 px-6 py-4 shadow-md">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="" />
              <span className="bg-red-500 absolute top-0 right-1 h-2 w-2 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <Dropdown user={user} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-2 overflow-y-auto text-black">
          {children}
        </main>
      </div>
    </div>
  );
}
