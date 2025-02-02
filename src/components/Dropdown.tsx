"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ChevronDown } from "lucide-react";

interface Userprops {
  user: {
    userName: string;
    email: string;
    avatar: string;
  };
}

export default function Dropdown({ user }: Userprops) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      if (response.status === 200) {
        router.push("/");
      }
    } catch (err: unknown) {
      console.log(err);

      // Handle error messages from the server
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
        onClick={toggleDropdown}
      >
        <span className="font-semibold text-black text-sm sm:text-lg">
          {user.userName}
        </span>
        <img src={user.avatar} alt="user image" className="w-8 rounded-full" />
        <ChevronDown className="w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-fit bg-white shadow-lg rounded-lg border border-gray-200 z-10">
          <ul className="text-black">
            <li className="text- px-4 py-2 text-gray-400">{user.email}</li>
            <li>
              <Link
                href="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
