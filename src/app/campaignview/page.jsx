// src/app/campaigns/[id]/page.jsx
import React from "react";
import { notFound } from "next/navigation";
import {
  Coins, CreditCard, GraduationCap, Shield, Tag, Calendar, Users2, Sparkles
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
// If you have Separator component, uncomment this:
// import { Separator } from "../../../components/ui/separator";

/** ---------- Small helpers ---------- */
const ProgressBar = ({ value }) => (
  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
    <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

const formatMoney = (n) => {
  const x = Number(n || 0);
  if (x >= 1_000_000) return `$${(x / 1_000_000).toFixed(1)}M`;
  if (x >= 1_000) return `$${(x / 1_000).toFixed(1)}k`;
  return `$${x.toLocaleString()}`;
};

// simple avatar (initials)
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

/** ---------- Mock fallback ---------- */
function mockCampaign(id) {
  return {
    id,
    title: "Autonomous Robot Dog",
    school: "Sacramento State",
    description:
      "Quadruped with vision, SLAM, and voice commands. Built with Jetson, ROS2, and depth cameras. Milestone-based funding with weekly updates and public demos.",
    goal_amount: 5000,
    current_amount: 3120,
    tags: ["Robotics", "Computer Vision", "Embedded"],
    images: [
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=1600&auto=format&fit=crop",
    ],
    creator: { id: 10, name: "Alex Student" },
    team_members: [
      { id: 11, name: "Maya Vision" },
      { id: 12, name: "Drew Controls" },
    ],
    is_sponsored: true,
    sponsored_by: "Acme Robotics",
    start_date: "2025-08-15",
    end_date: "2025-12-10",
    milestones: [
      { title: "Gait & Balance", done: true },
      { title: "SLAM Navigation", done: false },
      { title: "Voice Commands", done: false },
    ],
    verified: true,
  };
}

/** ---------- Data fetch ---------- */
async function getCampaign(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : ""}/api/campaigns/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    // expected shape example:
    // {
    //   id, title, description, goal_amount, current_amount, school, tags:[],
    //   images:[], creator:{id,name}, team_members:[{id,name},...],
    //   is_sponsored, sponsored_by, start_date, end_date, milestones:[{title,done}], verified
    // }
    return data;
  } catch {
    // fallback to mock so page renders during wiring
    return mockCampaign(id);
  }
}

export default async function CampaignPage({ params }) {
  const { id } = params;
  const c = await getCampaign(id);
  if (!c) return notFound();

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
                      {c.team_members.map((m) => (
                        <div key={m.id} className="flex items-center gap-3">
                          <Avatar name={m.name} />
                          <div className="text-sm">
                            <div className="font-medium">{m.name}</div>
                            <div className="text-muted-foreground">Contributor</div>
                          </div>
                        </div>
                      ))}
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
