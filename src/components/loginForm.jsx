"use client";

import { useAuth } from "@/components/authProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const LOGIN_URL = "/api/login/";

export function LoginForm({ className, ...props }) {
  const auth = useAuth();
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const objectFormForm = Object.fromEntries(formData);
    const jsonData = JSON.stringify(objectFormForm);

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // fixed typo: "appplication"
        },
        body: jsonData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Logged In");
        auth.login(); // Trigger global login handler
      } else {
        setError(data?.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username and password to log in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Your Username"
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
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
