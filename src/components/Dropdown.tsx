"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ChevronDown, User, LogOut, BellRing, Bell } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProps {
  user: {
    userName: string;
    email: string;
    avatar: string;
  };
}

export default function Dropdown({ user }: UserProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      if (response.status === 200) {
        router.push("/");
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <DropdownMenu>
      {/* Dropdown Button */}
      <DropdownMenuTrigger asChild>
        <div className=" flex items-center justify-center gap-4 rounded-md border px-4 py-1 cursor-pointer">
          <button className="relative">
            <Bell className="" />
            <span className="bg-red-500 absolute top-0 right-1 h-2 w-2 rounded-full"></span>
          </button>
          <span className="font-medium text-gray-800 text-sm sm:text-base">
            {user.userName}
          </span>
          <Image
            src={user.avatar}
            alt="User Avatar"
            className="w-9 h-9 rounded-full border border-gray-300"
            width={36}
            height={36}
          />
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent align="end" className="w-52">
        {/* User Info */}
        <div className="px-4 py-3 text-sm text-gray-700 border-b bg-gray-50">
          <span className="block font-medium">{user.userName}</span>
          <span className="text-gray-500">{user.email}</span>
        </div>

        {/* Profile */}
        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-3 px-4 py-3">
            <User className="w-5 h-5 text-gray-500" />
            Profile
          </Link>
        </DropdownMenuItem>

        {/* Logout */}
        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
