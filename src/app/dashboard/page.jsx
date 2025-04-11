"use client"
import useSWR from 'swr';
import { useEffect } from "react";
import { useAuth } from '@/components/authProvider';
import Link from "next/link";

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const fetcher = async (url) => {
    const res = await fetch(url);
    if (res.status === 401) {
      // maybe trigger a redirect or silent refresh
      throw new Error("Unauthorized");
    }
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    return res.json();
  };
  
  const CAMPAIGN_API_URL =  "/api/campaigns"



export default function Page() {
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                <BreadcrumbItem>
                  <BreadcrumbPage>View Your Campaigns</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {data?.map((campaign) => (
            <Link href={`/campaigns/${campaign.id}`} key={campaign.id}>
            <div className="bg-muted/50 aspect-video rounded-xl p-4 flex flex-col justify-between shadow-sm hover:bg-muted transition">
                <div>
                <h3 className="text-lg font-semibold">{campaign.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {campaign.description}
                </p>
                </div>
                <div className="mt-4 text-sm space-y-1">
                <p>👤 By: {campaign.creator?.username}</p>
                <p>🎯 Goal: ${campaign.goal_amount}</p>
                <p>💰 Raised: ${campaign.current_amount}</p>
                </div>

            </div>
            </Link>
        ))}
        </div>

      </SidebarInset>
    </SidebarProvider>
  );
}
