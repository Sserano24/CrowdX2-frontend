"use client"

import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json())
const CAMPAIGN_API_URL =  "/api/campaigns/"

export default function Home() {
  //GET REQUESTS
  const {data, error, isLoading} = useSWR(CAMPAIGN_API_URL,
    fetcher)
    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

  return (
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        
        <div>
          {JSON.stringify(data)}
        </div>
      </main>

  );
}
