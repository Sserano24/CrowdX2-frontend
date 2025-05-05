"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NEXT_API_UPDATE_URL = "/api/account/update";


export default function EditAccountPage() {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    wallet_address: "",
    links: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/account", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await res.json();
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          bio: data.bio || "",
          wallet_address: data.wallet_address || "",
          links: data.links || "",
          phone: data.phone_number || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Unable to load user info.");
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setSuccess("");
        setError("");
    
        try {
        const res = await fetch(NEXT_API_UPDATE_URL, {
            method: "PUT",
            credentials: "include", // 👈 ensures HTTP-only cookies are sent
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
    
        if (!res.ok) {
            const errText = await res.text();
            console.error("❌ Update failed:", res.status, errText);
            console.log("🔍 Final formData:", formData);

            throw new Error("Failed to update user info");
        }
    
        setSuccess("Account updated successfully!");
        setTimeout(() => router.push("/dashboard/account"), 1500);
        } catch (err) {
        console.error("🚨 Submission error:", err);
        setError("Failed to update account.");
        }
    }
  

  

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  if (loading) return <div className="p-6 text-white">Loading form...</div>;

  return (
    <div className="p-6 text-white">
      <div className="max-w-2xl mx-auto bg-[#1a1a1a] p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Edit Account Info</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Phone Number</label>
            <input
              name="phone_number"
              value={formData.phone}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Wallet Address</label>
            <input
              type="text"
              name="wallet_address"
              value={formData.wallet_address}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Profile Link</label>
            <input
              type="url"
              name="links"
              value={formData.links}
              onChange={handleChange}
              placeholder="https://yourlink.com"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              ✅ Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/account")}
              className="text-sm text-gray-400 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
