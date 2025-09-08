"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Search, Filter, Flame, Clock, Trophy, ChevronDown, ChevronRight,
  Coins, CreditCard, GraduationCap, Star
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import ExploreProjectCard from "../../components/ExploreProjectCard";

/* ---------------------------------
   Mock Data (replace with real API)
---------------------------------- */
const ALL_PROJECTS = [
  {
    id: 1,
    title: "Autonomous Robot Dog",
    school: "CSU Sacramento",
    description: "Quadruped with vision, SLAM, and voice commands.",
    goal_amount: 5000, current_amount: 3120,
    tags: ["Robotics", "Computer Vision", "Embedded"],
    trending_score: 91, created_at: "2025-08-20"
  },
  {
    id: 2,
    title: "AI Email Triage Assistant",
    school: "CSU Sacramento",
    description: "LLM-powered inbox summarization and smart replies.",
    goal_amount: 2500, current_amount: 1810,
    tags: ["AI/ML", "NLP", "SaaS"],
    trending_score: 76, created_at: "2025-08-28"
  },
  {
    id: 3,
    title: "CrowdX: Web3 Crowdfunding",
    school: "CSU Sacramento",
    description: "Crypto + fiat micro-funding for student projects.",
    goal_amount: 4000, current_amount: 2640,
    tags: ["Web3", "Django", "Next.js"],
    trending_score: 84, created_at: "2025-08-26"
  },
  {
    id: 4,
    title: "Vision-Based Drone Swarm",
    school: "UCLA",
    description: "Coordinated flight using onboard perception.",
    goal_amount: 9000, current_amount: 5200,
    tags: ["Robotics", "Computer Vision", "Aerospace"],
    trending_score: 88, created_at: "2025-08-29"
  },
  {
    id: 5,
    title: "Edge AI Fall Detection",
    school: "UC Davis",
    description: "Wearable device for real-time fall alerts.",
    goal_amount: 3000, current_amount: 1890,
    tags: ["AI/ML", "Embedded", "Healthcare"],
    trending_score: 73, created_at: "2025-08-18"
  },
  {
    id: 6,
    title: "Open Source FPGA Sandbox",
    school: "UC Berkeley",
    description: "Hands-on learning kits + online HDL playground.",
    goal_amount: 7000, current_amount: 4025,
    tags: ["Embedded", "Education", "Cloud & DevOps"],
    trending_score: 65, created_at: "2025-08-14"
  },
  {
    id: 7,
    title: "Zero-Knowledge Proof Playground",
    school: "Stanford",
    description: "Interactive lab for zk circuits + proofs.",
    goal_amount: 8000, current_amount: 3900,
    tags: ["Web3", "Cryptography"],
    trending_score: 86, created_at: "2025-08-30"
  },
  {
    id: 8,
    title: "Real-Time Sign Language Translator",
    school: "CSU Chico",
    description: "Camera-based ASL → speech using transformers.",
    goal_amount: 6000, current_amount: 4550,
    tags: ["AI/ML", "Computer Vision", "Accessibility"],
    trending_score: 94, created_at: "2025-08-31"
  },
  {
    id: 9,
    title: "Campus EV Charging Optimizer",
    school: "UC San Diego",
    description: "Smart queueing + dynamic pricing for chargers.",
    goal_amount: 5500, current_amount: 2100,
    tags: ["Cloud & DevOps", "SaaS", "Sustainability"],
    trending_score: 62, created_at: "2025-08-22"
  },
  {
    id: 10,
    title: "Low-Cost Prosthetic Hand",
    school: "Cal Poly",
    description: "3D-printed, sensor-rich adaptive gripper.",
    goal_amount: 9500, current_amount: 6150,
    tags: ["Robotics", "Healthcare", "Embedded"],
    trending_score: 90, created_at: "2025-08-27"
  },
];

/* ---------------------------
   Small UI helpers
----------------------------*/
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

// Helper to map ALL_PROJECTS to ExploreProjectCard expected props
function mapProjectToExploreCard(p) {
  return {
    ...p,
    goal: p.goal_amount,
    raised: p.current_amount,
    // Optionally add: slug, cover, blurb, verified, is_sponsored, sponsored_by, images, backers, days_left
  };
}

/* ---------------------------
   Explore Page
----------------------------*/
export default function ExplorePage() {
  // search / filters / sort
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [sortKey, setSortKey] = useState("trending"); // trending | funded | newest

  // pagination-ish (progressive reveal)
  const [visible, setVisible] = useState(6);
  const loadMoreRef = useRef(null);

  const QUICK_TAGS = [
    "Robotics", "AI/ML", "Computer Vision", "Embedded", "Web3", "Cloud & DevOps", "Healthcare", "Sustainability"
  ];

  // computed list
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    let rows = ALL_PROJECTS.filter(p => {
      const matchesText =
        !text ||
        p.title.toLowerCase().includes(text) ||
        p.description.toLowerCase().includes(text) ||
        p.tags?.some(t => t.toLowerCase().includes(text));
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every(t => p.tags?.includes(t));
      return matchesText && matchesTags;
    });

    // sort
    if (sortKey === "trending") {
      rows = rows.sort((a, b) => b.trending_score - a.trending_score);
    } else if (sortKey === "funded") {
      const fa = (x) => (x.current_amount || 0) / Math.max(1, x.goal_amount || 1);
      rows = rows.sort((a, b) => fa(b) - fa(a));
    } else if (sortKey === "newest") {
      rows = rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return rows;
  }, [query, activeTags, sortKey]);

  const visibleRows = filtered.slice(0, visible);

  // auto-load more when scrolled near bottom (IntersectionObserver)
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const ob = new IntersectionObserver((entries) => {
      const [e] = entries;
      if (e.isIntersecting) {
        setVisible((v) => Math.min(v + 6, filtered.length));
      }
    }, { rootMargin: "200px" });
    ob.observe(el);
    return () => ob.disconnect();
  }, [filtered.length]);

  function toggleTag(tag) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function clearFilters() {
    setActiveTags([]);
    setQuery("");
    setSortKey("trending");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Headline / Search */}
      <section className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
              <Flame className="w-3.5 h-3.5" /> Explore Projects
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              Discover student-built projects worth backing.
            </h1>
            <p className="text-muted-foreground">
              Browse by skills, see what’s trending, and find your next favorite build.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, skills, tech…"
                className="pl-9"
              />
              <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={sortKey === "trending" ? "default" : "secondary"}
                onClick={() => setSortKey("trending")}
                className="gap-2"
              >
                <Flame className="w-4 h-4" /> Trending
              </Button>
              <Button
                variant={sortKey === "funded" ? "default" : "secondary"}
                onClick={() => setSortKey("funded")}
                className="gap-2"
              >
                <Trophy className="w-4 h-4" /> Most Funded
              </Button>
              <Button
                variant={sortKey === "newest" ? "default" : "secondary"}
                onClick={() => setSortKey("newest")}
                className="gap-2"
              >
                <Clock className="w-4 h-4" /> Newest
              </Button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Quick filters:</span>
            {QUICK_TAGS.map((t) => {
              const active = activeTags.includes(t);
              return (
                <Button
                  key={t}
                  variant={active ? "default" : "secondary"}
                  onClick={() => toggleTag(t)}
                  className="h-8 rounded-full px-3 text-xs"
                >
                  {t}
                </Button>
              );
            })}
            {(activeTags.length > 0 || query) && (
              <Button variant="ghost" className="h-8 text-xs" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{visibleRows.length}</span> of{" "}
              <span className="font-medium">{filtered.length}</span> projects
            </div>
            <div className="text-xs text-muted-foreground hidden md:block">
              Tip: Try combining a quick filter with search (e.g., “Robotics slam”)
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {visibleRows.map((p) => (
              <ExploreProjectCard key={p.id} p={mapProjectToExploreCard(p)} />
            ))}
          </div>

          {/* Load more */}
          {visible < filtered.length && (
            <div ref={loadMoreRef} className="flex justify-center pt-8">
              <Button variant="secondary" className="gap-2" onClick={() => setVisible((v) => v + 6)}>
                Load more <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* No results */}
          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
              No projects match your filters. Try clearing them or searching something else.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
