'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function DynamicCheckoutPage() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { campaign_id } = useParams()

  const handleCheckout = async () => {
    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || isNaN(parsedAmount)) {
      alert("Please enter a valid amount")
      return
    }

    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          campaign_id: parseInt(campaign_id)
        })
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Payment error: " + JSON.stringify(data))
      }
    } catch (err) {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-gray-900">
        <h2 className="text-2xl font-bold mb-4 text-center">Donate to Campaign #{campaign_id}</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Enter an amount to contribute via Stripe</p>
        <input
          type="number"
          placeholder="Enter amount in USD"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 mb-4"
        />
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          {loading ? 'Redirecting to Stripe...' : 'Donate'}
        </button>
      </div>
    </div>
  )
}
