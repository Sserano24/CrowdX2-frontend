// src/app/create/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";

const contractABI = contractArtifact.abi;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function CreateCampaignPage() {
  const router = useRouter();

  // — your existing hooks, unchanged —
  const [title, setTitle]         = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount]   = useState("");
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ─── On-chain logic (exactly your original) ───
      if (!window.ethereum) throw new Error("MetaMask not detected");
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer   = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const goalWei = ethers.utils.parseEther(goalAmount.toString());
      const startTs = Math.floor(new Date(startDate).getTime() / 1000);
      const endTs   = Math.floor(new Date(endDate).getTime()   / 1000);

      const tx = await contract.createCampaign(
        title,
        description,
        goalWei,
        startTs,
        endTs
      );
      await tx.wait();
      // ──────────────────────────────────────────────

      // ─── Database logic (exactly your original) ───
      const payload = {
        title,
        description,
        goal_amount:  Number(goalAmount),
        start_date:   startDate,
        end_date:     endDate,
      };

      const res = await fetch("/api/campaigns/create", {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",  // include cookies
        body:        JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create campaign.");
      }
      // ────────────────────────────────────────────

      router.push("/dashboard/my-campaigns");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create Campaign</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
            required
          />
        </div>

        {/* Goal Amount */}
        <div>
          <label className="block font-semibold mb-1">Goal Amount (ETH)</label>
          <input
            type="number"
            step="0.01"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
}
