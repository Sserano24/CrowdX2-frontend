// src/app/campaigns/page.js
'use client'
import useSWR from 'swr'
import { useEffect, useState } from 'react'

const CAMPAIGN_API_URL = 'http://localhost:8000/api/campaigns'

const fetcher = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch campaigns')
  return res.json()
}

export default function CampaignsPage() {
  const { data, error, isLoading } = useSWR(CAMPAIGN_API_URL, fetcher)
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    if (data) setCampaigns(data)
  }, [data])

  useEffect(() => {
    if (!data) return

    const sockets = data.map((campaign) => {
      const socket = new WebSocket(`ws://localhost:8000/ws/campaigns/${campaign.id}/`)
      socket.onmessage = (event) => {
        const update = JSON.parse(event.data)
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaign.id ? { ...c, ...update } : c))
        )
      }
      return socket
    })

    return () => sockets.forEach((socket) => socket.close())
  }, [data])

  const handleDonate = async () => {
    const res = await fetch('http://localhost:8000/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 10 })
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Donation failed.')
    }
  }

  if (error) return <div className="text-red-500">Failed to load campaigns.</div>
  if (isLoading) return <div>Loading campaigns...</div>

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Active Campaigns</h1>
      <div className="space-y-4">
        {campaigns.length === 0 && <p>No campaigns found.</p>}
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="border rounded-xl p-4 shadow bg-white text-black"
          >
            <h2 className="text-xl font-semibold">{campaign.title}</h2>
            <p>{campaign.description}</p>
            <p className="text-sm text-gray-600">
              Goal: ${campaign.goal_amount} | Raised: ${campaign.current_amount}
            </p>
            <button
              onClick={handleDonate}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded"
            >
              Donate $10
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
