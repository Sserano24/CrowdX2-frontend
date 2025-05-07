"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";

const LOCAL_RPC_URL   = "http://127.0.0.1:8545";
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractABI     = contractArtifact.abi;

// SWR fetcher for Stripe/DB
const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function CampaignDetailPage() {
  // ---- params & normalized ID ----
  const params = useParams();
  const rawId  = params?.id || "";
  const id     = rawId.replace("onchain-", "");

  // ---- On‑chain state ----
  const [campaign,       setCampaign]       = useState(null);
  const [onChainError,   setOnChainError]   = useState("");
  const [onChainLoading, setOnChainLoading] = useState(true);
  const [userAddress,    setUserAddress]    = useState("");

  // ---- Shared donation amount & state ----
  const [donationAmount, setDonationAmount] = useState("");
  const [donating,       setDonating]       = useState(false);

  // ---- Stripe / DB state via SWR ----
  const {
    data: stripeData,
    error: stripeError,
    isLoading: stripeLoading
  } = useSWR(
    id ? `http://localhost:8001/api/campaigns/campaign/${id}/` : null,
    fetcher
  );

  // ---- fetch on‑chain campaign & user address ----
  useEffect(() => {
    async function fetchOnChain() {
      setOnChainLoading(true);
      setOnChainError("");
      try {
        let provider;
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          setUserAddress(await signer.getAddress());
        } else {
          provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
        }

        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const c        = await contract.viewCampaign(parseInt(id, 10));

        const goal     = parseFloat(ethers.utils.formatEther(c[2]));
        const raised   = parseFloat(ethers.utils.formatEther(c[3]));
        const progress = Math.min((raised / goal) * 100, 100);

        setCampaign({
          title:        c[0],
          description:  c[1],
          goal,
          raised,
          start:        new Date(c[4] * 1000).toLocaleString(),
          end:          new Date(c[5] * 1000).toLocaleString(),
          creator:      c[6].toLowerCase(),
          closed:       c[7],
          goalReached:  c[8],
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

  // ---- on‑chain donate ----
  const handleDonateChain = async () => {
    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }
    try {
      if (!window.ethereum) throw new Error("Install MetaMask first");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3     = new ethers.providers.Web3Provider(window.ethereum);
      const signer   = web3.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx       = await contract.donateCampaign(
        parseInt(id, 10),
        { value: ethers.utils.parseEther(donationAmount) }
      );
      await tx.wait();
      alert("On‑chain donation successful!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Donation failed: " + err.message);
    }
  };

  // ---- claim funds ----
  const handleClaimFunds = async () => {
    try {
      if (!window.ethereum) throw new Error("Install MetaMask first");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3     = new ethers.providers.Web3Provider(window.ethereum);
      const signer   = web3.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx       = await contract.claimFunds(parseInt(id, 10));
      await tx.wait();
      alert("Funds claimed!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Claim failed: " + err.message);
    }
  };

  // ---- Stripe donate ----
  const handleDonateStripe = async () => {
    const amt = parseFloat(donationAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    setDonating(true);
    try {
      const res = await fetch("http://localhost:8001/api/payments/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ amount: amt, campaign_id: parseInt(id, 10) })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Stripe error: ${txt}`);
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
      else alert("Donation failed: no redirect URL returned.");
    } catch (err) {
      console.error("Error loading campaign", id, err);
      setOnChainError(`❌ Failed to load campaign data for ID: ${id}`);
    }
     finally {
      setDonating(false);
    }
  };

  // ---- loading / error screens ----
  if (onChainError)   return <div className="p-6 text-red-600">{onChainError}</div>;
  if (onChainLoading) return <div className="p-6">Loading on‑chain campaign…</div>;
  if (!campaign)      return null;

  const {
    title, description, goal, raised,
    start, end, creator,
    goalReached, fundsClaimed, progress
  } = campaign;
  const isCreator = userAddress === creator;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* On‑chain Details */}
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-400">{description}</p>
      <div className="text-sm mt-4 space-y-1">
        <p>👤 Creator: {creator}</p>
        <p>🎯 Goal: {goal} ETH</p>
        <p>💰 Total Raised: {raised} ETH</p>
        <p>🏦 Funds Claimed: {fundsClaimed ? "✅ Yes" : "❌ No"}</p>
        <div className="mt-4 bg-gray-700 rounded-full h-4 w-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-green-500 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-300">{progress.toFixed(1)}% funded</p>
        <p>⏰ Starts: {start}</p>
        <p>🏁 Ends: {end}</p>
      </div>

      {/* Donation controls */}
      <div className="mt-6 flex flex-wrap gap-2">
        <input
          type="number"
          step="0.01"
          placeholder="ETH or USD"
          className="w-32 p-2 border rounded bg-black/20"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
        />
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
          {donating ? "Redirecting…" : "Donate with Stripe"}
        </button>
      </div>

      {/* Claim Funds button */}
      {isCreator && goalReached && !fundsClaimed && (
        <div className="mt-4">
          <button
            onClick={handleClaimFunds}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
          >
            Claim Funds
          </button>
        </div>
      )}

      {/* Off‑Chain (DB/Stripe) Campaign Info */}
      {stripeError && (
        <div className="p-4 text-red-600">❌ Failed to load DB campaign.</div>
      )}
      {stripeData && !stripeLoading && (
        <div className="mt-6 space-y-1 text-sm">
          <p><strong>DB Goal:</strong> ${Number(stripeData.goal_amount).toFixed(2)}</p>
          <p><strong>DB Raised:</strong> ${Number(stripeData.current_amount).toFixed(2)}</p>
          <p><strong>Starts:</strong> {new Date(stripeData.start_date).toLocaleDateString()}</p>
          <p><strong>Ends:</strong> {stripeData.end_date
            ? new Date(stripeData.end_date).toLocaleDateString()
            : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
