// src/app/cancel/page.js
'use client'

export default function CancelPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800">
      <h1 className="text-3xl font-bold mb-4">❌ Donation Canceled</h1>
      <p className="text-lg">No worries — you can always support a campaign later.</p>
      <a
        href="/campaigns"
        className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
      >
        Back to Campaigns
      </a>
    </main>
  )
}
