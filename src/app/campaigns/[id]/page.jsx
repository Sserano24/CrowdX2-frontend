"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";

const LOCAL_RPC_URL   = "http://127.0.0.1:8545";
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractABI     = contractArtifact.abi;

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function CampaignDetailPage() {
  // ---- params & normalized ID ----
  const params = useParams();
  const rawId  = params?.id || "";
  const id     = rawId.replace("onchain-", ""); // works for both "onchain-1" and "1"

  // ---- On‑chain state ----
  const [campaign,       setCampaign]       = useState(null);
  const [onChainError,   setOnChainError]   = useState("");
  const [onChainLoading, setOnChainLoading] = useState(true);

  // shared donation amount
  const [donationAmount, setDonationAmount] = useState("");

  // ---- Stripe / DB state via SWR ----
  const {
    data: stripeData,
    error: stripeError,
    isLoading: stripeLoading
  } = useSWR(
    id ? `http://localhost:8001/api/campaigns/campaign/${id}/` : null,
    fetcher
  );
  const [donating, setDonating] = useState(false);

  // ---- fetch on‑chain campaign ----
  useEffect(() => {
    async function fetchOnChain() {
      setOnChainLoading(true);
      setOnChainError("");
      try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const c = await contract.viewCampaign(parseInt(id));
        const goal   = parseFloat(ethers.utils.formatEther(c[2]));
        const raised = parseFloat(ethers.utils.formatEther(c[3]));
        const progress = Math.min((raised/goal)*100, 100);

        setCampaign({
          title:        c[0],
          description:  c[1],
          goal,
          raised,
          creator:      c[6],
          start:        new Date(c[4]*1000).toLocaleString(),
          end:          new Date(c[5]*1000).toLocaleString(),
          fundsClaimed: c[9],
          progress,
        });
      } catch (err) {
        console.error(err);
        setOnChainError("❌ Failed to load campaign data.");
      } finally {
        setOnChainLoading(false);
      }
    }
    if (id) fetchOnChain();
  }, [id]);

  // ---- on‑chain donation logic (unchanged) ----
  const handleDonateChain = async () => {
    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }
    try {
      if (!window.ethereum) {
        alert("Install MetaMask first");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer        = web3Provider.getSigner();
      const contract      = new ethers.Contract(contractAddress, contractABI, signer);

      const value = ethers.utils.parseEther(donationAmount);
      const tx    = await contract.donateCampaign(parseInt(id), { value });
      await tx.wait();

      alert("Donation successful!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Donation failed: " + err.message);
    }
  };

  // ---- Stripe donation logic (unchanged) ----
  const handleDonateStripe = async () => {
    const parsedAmount = parseFloat(donationAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    setDonating(true);
    try {
      const res = await fetch("http://localhost:8001/api/payments/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          amount:      parsedAmount,
          campaign_id: parseInt(id),
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
        alert("Donation failed: no redirect URL returned.");
      }
    } catch (err) {
      console.error("Donation error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setDonating(false);
    }
  };

  // ---- loading / error screens ----
  if (onChainError) {
    return <div className="p-6 text-red-600">{onChainError}</div>;
  }
  if (onChainLoading || !campaign) {
    return <div className="p-6">Loading on‑chain campaign…</div>;
  }

  // ---- main UI ----
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* ─── On‑Chain Details ─────────────────────────── */}
      <h1 className="text-3xl font-bold">{campaign.title}</h1>
      <p className="text-gray-400">{campaign.description}</p>

      <div className="text-sm mt-4 space-y-1">
        <p>👤 Creator: {campaign.creator}</p>
        <p>🎯 Goal: {campaign.goal} ETH</p>
        <p>💰 Total Raised: {campaign.raised} ETH</p>
        <p>🏦 Funds Claimed: {campaign.fundsClaimed ? "✅ Yes" : "❌ No"}</p>

        <div className="mt-4 bg-gray-700 rounded-full h-4 w-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-green-500 transition-all duration-700 ease-in-out"
            style={{ width: `${campaign.progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-300">
          {campaign.progress.toFixed(1)}% funded
        </p>

        <p>⏰ Starts: {campaign.start}</p>
        <p>🏁 Ends: {campaign.end}</p>
      </div>

      {/* ─── Unified Donation Controls ───────────────── */}
      <div className="mt-6 space-y-4">
        <input
          type="number"
          step="0.01"
          placeholder="Enter ETH or USD amount"
          className="w-32 p-2 border rounded bg-black/20"
          value={donationAmount}
          onChange={e => setDonationAmount(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={handleDonateChain}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
          >
            Donate On‑Chain
          </button>

          <button
            onClick={handleDonateStripe}
            disabled={donating || stripeLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            {donating ? "Redirecting to Stripe..." : "Donate with Stripe"}
          </button>
        </div>
      </div>

      {/* ─── Off‑Chain (DB/Stripe) Campaign Info ───────── */}
      {stripeError && (
        <div className="p-4 text-red-600">❌ Failed to load DB campaign.</div>
      )}
      {stripeData && !stripeLoading && (
        <div className="mt-6 space-y-1 text-sm">
          <p>
            <strong>DB Goal:</strong> ${Number(stripeData.goal_amount).toFixed(2)}
          </p>
          <p>
            <strong>DB Raised:</strong> ${Number(stripeData.current_amount).toFixed(2)}
          </p>
          <p>
            <strong>Starts:</strong>{" "}
            {new Date(stripeData.start_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Ends:</strong>{" "}
            {stripeData.end_date
              ? new Date(stripeData.end_date).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
