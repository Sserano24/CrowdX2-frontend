"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:8001/api/accounts/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load user info.");
      }
    }

    fetchUser();
  }, []);

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="p-6 text-white">Loading account info...</div>;
  }

  return (
    <div className="p-6 text-white">
      <div className="max-w-2xl mx-auto bg-[#1a1a1a] p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Account Info</h1>

        <div className="space-y-3">
          <div>
            <span className="font-semibold">Username:</span>{" "}
            <span className="text-gray-300">{user.username}</span>
          </div>
          <div>
            <span className="font-semibold">Email:</span>{" "}
            <span className="text-gray-300">{user.email}</span>
          </div>
          <div>
            <span className="font-semibold">First Name:</span>{" "}
            <span className="text-gray-300">{user.first_name || "—"}</span>
          </div>
          <div>
            <span className="font-semibold">Last Name:</span>{" "}
            <span className="text-gray-300">{user.last_name || "—"}</span>
          </div>
          <div>
            <span className="font-semibold">Phone:</span>{" "}
            <span className="text-gray-300">{user.phone_number || "—"}</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard/edit-account")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            ✏️ Edit Account
          </button>
        </div>
      </div>
    </div>
  );
}
