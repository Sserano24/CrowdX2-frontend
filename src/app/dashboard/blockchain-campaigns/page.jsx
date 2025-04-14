"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";

// Extract the ABI array from the artifact
const contractABI = contractArtifact.abi;
// Replace with your actual deployed contract address
const contractAddress = "0xAc3A1a8E00DcC8435a528D9f09afa99e4b082d1D";

export default function BlockchainCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      setError("");
      try {
        // Check for a Web3 provider (MetaMask)
        if (typeof window.ethereum === "undefined") {
          throw new Error("MetaMask is not installed. Please install it and try again.");
        }

        // Request wallet access from MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        // Create an ethers.js provider and instantiate the contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Get the current campaign counter from the contract
        const counterBN = await contract.campaignCounter();
        const counter = counterBN.toNumber();

        // If no campaigns have been created yet, counter will be 1
        if (counter <= 1) {
          setCampaigns([]);
          return;
        }

        // Prepare promises to fetch each campaign (assuming campaigns are indexed from 1 to counter-1)
        const campaignPromises = [];
        for (let i = 1; i < counter; i++) {
          campaignPromises.push(contract.campaigns(i));
        }
        const campaignResults = await Promise.all(campaignPromises);

        // Format the fetched campaign data:
        // - Convert goalAmount and currentAmount from Wei to ETH.
        // - Convert Unix timestamps to human-readable strings.
        const formattedCampaigns = campaignResults.map((camp, idx) => ({
          id: idx + 1, // Since campaign IDs start at 1
          title: camp.title,
          description: camp.description,
          goalAmount: ethers.utils.formatEther(camp.goalAmount),
          currentAmount: ethers.utils.formatEther(camp.currentAmount),
          startTime: new Date(camp.startTime * 1000).toLocaleString(),
          endTime: new Date(camp.endTime * 1000).toLocaleString(),
          creator: camp.creator,
        }));

        setCampaigns(formattedCampaigns);
      } catch (err) {
        console.error("Error fetching blockchain campaigns:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  if (loading) return <div className="p-4">Loading on-chain campaigns...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (campaigns.length === 0) return <div className="p-4">No campaigns found on-chain.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Campaigns on the Blockchain</h1>
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="border rounded p-4 mb-4 shadow">
          <h2 className="text-xl font-semibold">{campaign.title}</h2>
          <p>{campaign.description}</p>
          <div className="mt-2 text-sm">
            <p>🎯 Goal: {campaign.goalAmount} ETH</p>
            <p>💰 Raised: {campaign.currentAmount} ETH</p>
            <p>⏰ Starts: {campaign.startTime}</p>
            <p>⏱ Ends: {campaign.endTime}</p>
            <p>👤 Creator: {campaign.creator}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
