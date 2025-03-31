// src/app/checkout/page.js
'use client'
import { useState } from 'react'

export default function CheckoutPage() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      return alert("Please enter a valid amount")
    }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) })
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
        <h2 className="text-2xl font-bold mb-4 text-center">Support a Campaign</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Enter an amount to contribute to a CrowdX campaign securely via Stripe.</p>
        <input
          type="number"
          placeholder="Enter amount in USD"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          {loading ? 'Redirecting...' : 'Pay with Stripe'}
        </button>
      </div>
    </div>
  )
}
