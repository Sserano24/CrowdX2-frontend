"use client"

import useSWR from 'swr';
import { useEffect } from "react";
import { useAuth } from '@/components/authProvider';
const fetcher = async url => {
  const res = await fetch(url)
 
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    throw error
  }
 
  return res.json()
}
const CAMPAIGN_API_URL =  "/api/campaigns"

export default function Home() {
  //GET REQUESTS
  const {data, error, isLoading} = useSWR(CAMPAIGN_API_URL,
    fetcher)
    const auth = useAuth()
    useEffect(()=>{
      if(error?.status ===401){
        auth.loginRequiredRedirect()
      }
    }, [auth, error])

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
