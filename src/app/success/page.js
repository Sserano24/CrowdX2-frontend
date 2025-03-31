// src/app/success/page.js
'use client'

export default function SuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-green-800">
      <h1 className="text-3xl font-bold mb-4">🎉 Donation Successful!</h1>
      <p className="text-lg">Thank you for contributing to this campaign.</p>
      <a
        href="/campaigns"
        className="mt-6 inline-block px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        Back to Campaigns
      </a>
    </main>
  )
}
