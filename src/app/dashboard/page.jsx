"use client";

import React from "react";
import {
  Plus, TrendingUp, BadgeCheck, Coins, CreditCard, Pencil, Eye, Trash2,
  Rocket, Users2, Calendar, Star, GraduationCap
} from "lucide-react";

// NOTE: relative paths from /src/app/dashboard/page.jsx → /src/components/ui/*
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

/* ---------------------------
   Test (mock) data — no APIs
----------------------------*/
const me = { first_name: "Alex", last_name: "Student" };

const stats = {
  active_projects: 3,
  funds_raised: 84200,     // dollars
  active_creators: 12,
};

const mine = {
  items: [
    {
      id: 1,
      title: "Autonomous Robot Dog",
      description: "Quadruped with vision, SLAM, and voice commands.",
      current_amount: 3120,
      goal_amount: 5000,
      school: "Sacramento State",
      tags: ["Robotics", "Computer Vision", "Embedded"],
    },
    {
      id: 2,
      title: "AI Email Triage Assistant",
      description: "LLM-powered inbox summarization and smart replies.",
      current_amount: 1810,
      goal_amount: 2500,
      school: "Sacramento State",
      tags: ["AI/ML", "NLP", "SaaS"],
    },
    {
      id: 3,
      title: "CrowdX: Web3 Crowdfunding",
      description: "Crypto + fiat micro-funding for student projects.",
      current_amount: 2640,
      goal_amount: 4000,
      school: "Sacramento State",
      tags: ["Web3", "Django", "Next.js"],
    },
  ],
};

/* ---------------------------
   Small UI helpers
----------------------------*/
const Stat = ({ icon: Icon, label, value }) => (
  <Card className="rounded-2xl">
    <CardContent className="p-6 flex items-center gap-4">
      <div className="size-10 rounded-xl bg-primary/10 grid place-items-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-bold leading-tight">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </CardContent>
  </Card>
);

const ProgressBar = ({ value }) => (
  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
    <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

function formatMoney(n) {
  const x = Number(n || 0);
  if (x >= 1_000_000) return `$${(x / 1_000_000).toFixed(1)}M`;
  if (x >= 1_000) return `$${(x / 1_000).toFixed(1)}k`;
  return `$${x.toLocaleString()}`;
}

const ProjectCard = ({ p }) => {
  const pct = p.goal > 0 ? Math.round((p.raised / p.goal) * 100) : 0;
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">{p.title}</CardTitle>
            <CardDescription>{p.blurb}</CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1 shrink-0">
            <GraduationCap className="w-3.5 h-3.5" /> {p.school ?? "—"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.isArray(p.tags) && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Badge key={t} className="rounded-full" variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        )}
        <ProgressBar value={pct} />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{formatMoney(p.raised)} raised</span>
          <span className="text-muted-foreground">of {formatMoney(p.goal)} goal</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1">
          Fund with <CreditCard className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="secondary" className="flex-1">
          Fund with <Coins className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function DashboardPage() {
  // transform mock "mine" into card shape
  const myProjects = mine.items.map((p) => ({
    id: p.id,
    title: p.title,
    blurb: p.description,
    goal: Number(p.goal_amount || 0),
    raised: Number(p.current_amount || 0),
    tags: Array.isArray(p.tags) ? p.tags : [],
    school: p.school ?? "—",
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Header / Greeting */}
      <section className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Welcome back</div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {me?.first_name ? `${me.first_name} ${me.last_name ?? ""}`.trim() : "Your Dashboard"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> New Project
            </Button>
            <Button variant="secondary" className="gap-2">
              <Rocket className="w-4 h-4" /> Explore
            </Button>
          </div>
        </div>
      </section>

      {/* KPI Tiles */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat icon={TrendingUp} label="Active Projects" value={(stats?.active_projects ?? 0).toLocaleString()} />
          <Stat icon={Coins} label="Funds Raised" value={formatMoney(stats?.funds_raised)} />
          <Stat icon={Users2} label="Active Creators" value={(stats?.active_creators ?? 0).toLocaleString()} />
          <Stat icon={BadgeCheck} label="Profile Strength" value="80%" />
        </div>
      </section>

      {/* Search / Filters */}
      <section className="pb-2">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center gap-3">
          <Input className="w-80" placeholder="Search your projects…" />
          <Button variant="secondary" className="gap-2"><Calendar className="w-4 h-4" /> Last 30 days</Button>
          <Button variant="secondary" className="gap-2"><Star className="w-4 h-4" /> Most funded</Button>
        </div>
      </section>

      {/* My Projects */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">My Projects</h2>
            <div className="flex gap-2">
              <Button variant="secondary" className="gap-2"><Eye className="w-4 h-4" /> Preview</Button>
              <Button className="gap-2"><Plus className="w-4 h-4" /> New Project</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {myProjects.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Pencil className="w-5 h-5" /> Draft Update</CardTitle>
              <CardDescription>Share progress, demos, milestones with backers.</CardDescription>
            </CardHeader>
            <CardFooter className="px-6 pb-6">
              <Button variant="secondary">Open editor</Button>
            </CardFooter>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users2 className="w-5 h-5" /> Invite Teammates</CardTitle>
              <CardDescription>Add collaborators to manage your campaign.</CardDescription>
            </CardHeader>
            <CardFooter className="px-6 pb-6">
              <Button variant="secondary">Invite</Button>
            </CardFooter>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trash2 className="w-5 h-5" /> Manage</CardTitle>
              <CardDescription>Settings, payouts, verifications.</CardDescription>
            </CardHeader>
            <CardFooter className="px-6 pb-6">
              <Button variant="secondary">Open settings</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
