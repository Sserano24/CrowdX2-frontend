// ---------- Imports ----------
import React from "react";
import { Coins, CreditCard, GraduationCap, Shield, Tag, Calendar, Users2, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



// ---------- Helpers ----------

// Progress bar for funding
const ProgressBar = ({ value }) => (
  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
    <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

// Format money values for display
const formatMoney = (n) => {
  const x = Number(n || 0);
  if (x >= 1_000_000) return `$${(x / 1_000_000).toFixed(1)}M`;
  if (x >= 1_000) return `$${(x / 1_000).toFixed(1)}k`;
  return `$${x.toLocaleString()}`;
};

// Simple avatar (initials from name)
function Avatar({ name = "User" }) {
  const initials = name
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className="size-10 rounded-full bg-primary/10 grid place-items-center text-sm font-semibold">
      {initials || "?"}
    </div>
  );
}

// ---------- Data Fetch ----------

// Fetch campaign details from API, forwarding cookies for SSR
async function getCampaign(id) {
  try {
    const base = typeof window === "undefined" ? "http://localhost:3000" : "";
    const url = `${base}/api/campaigns/${id}`;
    let fetchOptions = { cache: "no-store" };
    // Forward cookies for SSR (server-side)
    if (typeof window === "undefined") {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore?.getAll?.()
        ?.map((c) => `${c.name}=${c.value}`)
        .join("; ");
      if (cookieHeader) {
        fetchOptions.headers = { cookie: cookieHeader };
      }
    }
    const res = await fetch(url, fetchOptions);

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      return { error: "Expected JSON from API", detail: text.slice(0, 300) };
    }

    const data = await res.json();
    if (!res.ok || data?.error) {
      return { error: data?.error || `API ${res.status}` };
    }
    return data;
  } catch {
    return { error: "Failed to fetch campaign" };
  }
}

// ---------- Page Component ----------

export default async function CampaignPage({ params }) {
  // Get campaign id from params
  const { id } = await params;
  // Fetch campaign data
  const c = await getCampaign(id);

  // Error handling: show error message if fetch fails
  if (!c || c.error) 
    redirect("/login");


  // Calculate funding progress percentage
  const pct = c.goal_amount > 0 ? Math.round((Number(c.current_amount) / Number(c.goal_amount)) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Header strip */}
      <section className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5" /> Campaign
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{c.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> {c.school ?? "—"}
              </Badge>
              {c.verified && (
                <Badge className="gap-1" variant="outline">
                  <Shield className="w-3.5 h-3.5" /> Verified
                </Badge>
              )}
              {c.is_sponsored && (
                <Badge className="gap-1">
                  <Tag className="w-3.5 h-3.5" /> Sponsored{c.sponsored_by ? ` by ${c.sponsored_by}` : ""}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="gap-2">
              Fund with <CreditCard className="w-4 h-4" />
            </Button>
            <Button variant="secondary" className="gap-2">
              Fund with <Coins className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {/* Left: Gallery + About */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                {Array.isArray(c.images) && c.images.length > 0 ? (
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-8 overflow-hidden rounded-xl">
                      <img
                        src={c.images[0]}
                        alt={`${c.title} image 1`}
                        className="w-full h-[320px] object-cover"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-3">
                      {c.images.slice(1, 3).map((src, i) => (
                        <div key={i} className="overflow-hidden rounded-xl">
                          <img src={src} alt={`${c.title} image ${i + 2}`} className="w-full h-[158px] object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 grid place-items-center text-muted-foreground">No images yet</div>
                )}
              </CardContent>
            </Card>

            {/* About */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>About this project</CardTitle>
                <CardDescription>Overview, goals, and approach</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-6">{c.description}</p>

                {/* Tags */}
                {Array.isArray(c.tags) && c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {c.tags.map((t) => (
                      <Badge key={t} variant="outline" className="rounded-full">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Dates */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {c.start_date && (
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Start: {new Date(c.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {c.end_date && (
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> End: {new Date(c.end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>Track progress across key deliverables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.isArray(c.milestones) && c.milestones.length > 0 ? (
                  c.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input type="checkbox" checked={!!m.done} readOnly className="size-4 accent-primary" />
                      <span className={`text-sm ${m.done ? "line-through text-muted-foreground" : ""}`}>{m.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No milestones yet.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Funding + Team */}
          <div className="lg:col-span-1 space-y-6">
            {/* Funding panel */}
            <Card className="rounded-2xl border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Fund this project</CardTitle>
                <CardDescription>Milestone-based payouts. Transparent updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProgressBar value={pct} />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{formatMoney(c.current_amount)} raised</span>
                  <span className="text-muted-foreground">of {formatMoney(c.goal_amount)} goal</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button className="gap-2">
                    <CreditCard className="w-4 h-4" /> Fund (Fiat)
                  </Button>
                  <Button variant="secondary" className="gap-2">
                    <Coins className="w-4 h-4" /> Fund (Crypto)
                  </Button>
                </div>
                {c.is_sponsored && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Sponsored</span>
                    {c.sponsored_by ? ` by ${c.sponsored_by}` : ""}. Sponsorships highlight projects and may unlock perks.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="w-5 h-5" /> Creators & Team
                </CardTitle>
                <CardDescription>People behind the project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Creator */}
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Creator</div>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.creator?.name} />
                    <div className="text-sm">
                      <div className="font-medium">{c.creator?.name ?? "—"}</div>
                      <div className="text-muted-foreground">Project lead</div>
                    </div>
                  </div>
                </div>
                {/* Team members */}
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Team Members</div>
                  {Array.isArray(c.team_members) && c.team_members.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {c.team_members.map((m) => {
                        return (
                          <div key={m.id} className="flex items-center gap-3">
                            <Avatar name={m.name} />
                            <div className="text-sm">
                              <div className="font-medium">{m.name}</div>
                              <div className="text-muted-foreground">Contributor</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No team members listed.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Safety / Trust */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Safety & Transparency
                </CardTitle>
                <CardDescription>How funds are handled</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Funds are held in escrow and released by milestones. Backers see updates and deliverables before each release.</p>
                <p>Projects may be verified through campus or partner checks.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

/** 
 * Optional: tell Next.js this page is dynamic (no caching) 
 * so progress updates appear on refresh.
 */
export const dynamic = "force-dynamic";
