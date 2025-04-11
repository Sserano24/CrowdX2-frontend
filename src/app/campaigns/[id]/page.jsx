"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id;

  const { data, error, isLoading } = useSWR(
    id ? `/api/campaigns/${id}/` : null,
    fetcher
  );

  const [amount, setAmount] = useState("");

  const handleDonate = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/payments/create-checkout-session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          campaign_id: id,
        }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Stripe error: ${errorText}`);
      }
  
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("Donation failed: no URL returned.");
      }
    } catch (err) {
      console.error("Donation error:", err);
      alert("Something went wrong. Try again.");
    }
  };
  
  

  if (error) return <div className="p-4">Failed to load campaign.</div>;
  if (isLoading || !data) return <div className="p-4">Loading campaign...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="text-muted-foreground">{data.description}</p>

      <div className="text-sm mt-4 space-y-1">
        <p>🎯 <strong>Goal:</strong> ${data.goal_amount}</p>
        <p>💰 <strong>Raised:</strong> ${data.current_amount}</p>
        <p>📅 <strong>Starts:</strong> {new Date(data.start_date).toLocaleDateString()}</p>
        <p>🏁 <strong>Ends:</strong> {data.end_date ? new Date(data.end_date).toLocaleDateString() : "N/A"}</p>
        <p>📌 <strong>Created:</strong> {new Date(data.created_at).toLocaleString()}</p>
        <p>🛠️ <strong>Updated:</strong> {new Date(data.updated_at).toLocaleString()}</p>
      </div>

      {/* 💳 Donation Section */}
      <div className="mt-6 space-y-2">
        <input
          type="number"
          placeholder="Enter amount (e.g., 20)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded w-full max-w-xs"
        />
        <button
          onClick={handleDonate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Donate with Stripe
        </button>
      </div>
    </div>
  );
}
