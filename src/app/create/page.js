"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCampaignPage() {
  const router = useRouter();

  // State variables for the form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prepare the payload to match the Django API schema.
    const payload = {
      title,
      description,
      goal_amount: Number(goalAmount),
      start_date: startDate, // expects an ISO format date e.g. "2025-04-10"
      end_date: endDate,     // also an ISO date; can be empty if not provided
    };

    try {
      // The POST request goes directly to Django on port 8001.
      const res = await fetch("/api/campaigns/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // If the response is not OK, throw an error.
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create campaign.");
      }

      // Parse the JSON response
      const result = await res.json();

      // Redirect to the new campaign's detail page (assuming result.id is returned)
      router.push(`/dashboard/my-campaigns`);
    } catch (err) {
      console.error("Failed to create campaign:", err);
      setError("Failed to create campaign. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create Campaign</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Goal Amount ($)</label>
          <input
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
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
