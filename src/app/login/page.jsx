"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LOGIN_URL = "/api/login/";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("username"); // field is labeled "username" but sent as email
    const password = formData.get("password");

    const payload = JSON.stringify({ email, password });

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data?.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:to-black p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-8 p-8 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-blue-200 dark:border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          CrowdX Inc.
        </Link>

        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    id="username"
                    name="username"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your Password"
                    required
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-500 text-center -mt-2">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don’t have an account?
          <Link
            href="/signup"
            className="ml-1 font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
