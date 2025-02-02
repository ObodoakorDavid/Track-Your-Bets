import React from "react";
import Sidebar from "@/components/sidebar";
import Dropdown from "@/components/Dropdown";
import { cookies } from "next/headers";
import { Bell } from "lucide-react";
import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // If there's no token, return null instead of redirecting
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/api/user`, {
      headers: {
        Cookie: `token=${token};`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Handle redirect at the layout level
  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-background text-black border-b-2 border-gray-300 px-8 md:px-6 py-4 shadow-md">
          <h2 className="text-sm sm:text-lg font-semibold">
            Welcome, {user?.userName} 👋
          </h2>
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
        <main className="flex-1 bg-gray-100 overflow-y-auto text-black">
          {children}
        </main>
      </div>
    </div>
  );
}
