import { ethers } from "ethers";
import contractArtifact from "@/lib/CrowdXCampaign.json";
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



  // ---- loading / error screens ----
  if (onChainError)   return <div className="p-6 text-red-600">{onChainError}</div>;
  if (onChainLoading) return <div className="p-6">Loading on‑chain campaign…</div>;
  if (!campaign)      return null;