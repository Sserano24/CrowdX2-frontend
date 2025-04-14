"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
// Import your contract's ABI—ensure the path is correct according to your alias or folder structure.
import contractArtifact from "@/lib/CrowdXCampaign.json";
const contractABI = contractArtifact.abi;
const contractAddress = "0xAc3A1a8E00DcC8435a528D9f09afa99e4b082d1D";

export default function CreateCampaignPage() {
  const router = useRouter();

  // Form state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle form submission that calls the smart contract directly
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if a Web3 provider (e.g., MetaMask) is available
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Please install it and try again.");
      }

      // Request account access from MetaMask
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // Create a provider and signer with ethers.js
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a contract instance to interact with
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Convert the goal amount from ETH (string) to Wei (big number)
      const goalAmountWei = ethers.utils.parseEther(goalAmount);

      // Convert start and end dates (which are strings from input type="date")
      // to Unix timestamps (in seconds)
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

      // Call the smart contract's createCampaign function.
      // The contract will assign an on-chain ID automatically.
      const tx = await contract.createCampaign(
        title,
        description,
        goalAmountWei,
        startTimestamp,
        endTimestamp
      );

      console.log("Transaction sent:", tx.hash);
      // Wait for the transaction to be mined
      await tx.wait();
      console.log("Campaign created successfully!");

      // Redirect to your dashboard or another appropriate page
      router.push(`/dashboard/my-campaigns`);
    } catch (err) {
      console.error("Error creating campaign:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create Campaign (On-Chain)</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
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
          <label className="block font-semibold mb-1">Goal Amount (in ETH)</label>
          <input
            type="number"
            step="0.01"
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
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating Campaign..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
}
