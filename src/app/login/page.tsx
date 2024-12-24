"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setError(null); // Clear previous error
      const response = await axios.post("/api/auth/login", data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Redirect to dashboard after successful login
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center text-black bg-gray-200">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-white text-black">
        <h1 className="text-2xl font-bold text-primary mb-6">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium pb-1">Email</label>
            <Input
              type="email"
              {...register("email", { required: "Email is required" })}
              className={`w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-black placeholder-muted focus:outline-none focus:ring focus:ring-hover`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium pb-1">Password</label>
            <Input
              type="password"
              {...register("password", { required: "Password is required" })}
              className={`w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-black placeholder-muted focus:outline-none focus:ring focus:ring-hover`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-foreground text-background rounded-md hover:bg-hover disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-sm">
          Don&apost have an account?
          <a
            href="/signup"
            className="text-primary underline font-semibold hover:text-hover"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
