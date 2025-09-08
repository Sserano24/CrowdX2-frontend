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