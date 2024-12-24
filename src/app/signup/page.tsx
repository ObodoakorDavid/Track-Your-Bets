"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignupFormData {
  userName: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/signup", data);

      if (response.status === 201) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An unexpected error occurred");
      } else {
        // Fallback for non-Axios errors
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center text-black bg-gray-200">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-white text-black">
        <div className="text-center mb-4 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-primary text-center">
            Sign Up
          </h1>
          <p>Enter your username, email and password to register </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <Input
              {...register("userName", { required: "Name is required" })}
              type="text"
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-black placeholder-muted focus:outline-none focus:ring focus:ring-hover"
              placeholder="Enter your Username"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1 text-end">
                {errors.userName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>

            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-black placeholder-muted focus:outline-none focus:ring focus:ring-hover"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 text-end">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters",
                },
              })}
              type="password"
              className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-black placeholder-muted focus:outline-none focus:ring focus:ring-hover"
              placeholder="Create a password"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1 text-end">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-foreground text-background rounded-md hover:bg-hover disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary underline font-semibold hover:text-hover"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
