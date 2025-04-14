'use client'

import { useSearchParams } from 'next/navigation'

export default function CancelPage() {
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaign_id')

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800">
      <h1 className="text-3xl font-bold mb-4">❌ Donation Canceled</h1>
      <p className="text-lg">No worries — you can always support a campaign later.</p>
      <a
        href={`/campaigns/${campaignId}`}
        className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
      >
        Back to Campaign
      </a>
    </main>
  )
}
