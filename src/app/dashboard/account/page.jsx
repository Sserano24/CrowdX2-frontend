"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/account", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user info");

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

        <div className="w-32 h-32 rounded-full bg-gray-700 mb-4 mx-auto flex items-center justify-center">
          <span className="text-gray-400 text-sm">Profile Image</span>
        </div>

        <div className="space-y-3">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>First Name:</strong> {user.first_name || "—"}</p>
          <p><strong>Last Name:</strong> {user.last_name || "—"}</p>
          <p><strong>Bio:</strong> {user.bio || "—"}</p>
          <p><strong>Phone:</strong> {user.phone_number || "—"}</p>
          <p><strong>Wallet Address:</strong> {user.wallet_address || "—"}</p>
          <p>
            <strong>Profile Link:</strong>{" "}
            {user.links ? (
              <a
                href={user.links}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {user.links}
              </a>
            ) : (
              "—"
            )}
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard/edit-account")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ✏️ Edit Account
          </button>
        </div>
      </div>
    </div>
  );
}
