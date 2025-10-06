"use client";

import React from "react";
import SpotlightUsers from "../components/userCardSmall";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Rocket, GraduationCap, Coins, CreditCard, Users2, Share2, Shield,
  Briefcase, Filter, Search, Star, ArrowRight, Globe, Cpu, Bot, Code2
} from "lucide-react";
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";



import useSWR from "swr";
import { useMemo } from "react";
import { id } from "ethers/lib/utils";

const fetcher = (url) =>
  fetch(url, { cache: "no-store" }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to fetch");
    return data;
  });

const mapSpotlightToFeatured = (items = []) =>
  items.map((p) => ({
    id: p.id,
    title: p.title,
    school: p.school,
    blurb: p.description,
    goal: Number(p.goal_amount || 0),
    raised: Number(p.current_amount || 0),
    tags: Array.isArray(p.tags) ? p.tags : [],
  }));

const skillFilters = [
  "Embedded Systems",
  "AI/ML",
  "Robotics",
  "Computer Vision",
  "Web3",
  "Cloud & DevOps",
];

// ---- Small UI bits ----
const Stat = ({ label, value }) => (
  <div className="text-center">
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
    <div className="h-full bg-primary" style={{ width: `${value}%` }} />
  </div>
);

const ProjectCard = ({ p }) => {
  const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{p.title}</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> {p.school}
          </Badge>
        </div>
        <CardDescription>{p.blurb}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <Badge key={t} className="rounded-full" variant="outline">
              {t}
            </Badge>
          ))}
        </div>
        <ProgressBar value={pct} />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">${p.raised.toLocaleString()} raised</span>
          <span className="text-muted-foreground">of ${p.goal.toLocaleString()} goal</span>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 md:px-6">
        <Button asChild className="w-full gap-2">
          <Link href={`/campaigns/${p.id}`}>
            View Project <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// ---- Page ----
export default function CrowdXLanding() {
  const router = useRouter();
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [query, setQuery] = useState("");
  const handleSearch = () => setQuery(projectSearch.trim());


  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats", {
          method: "GET",
        });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load user stats.");
      }
    }
    fetchStats();
  }, []);

  // Featured projects from API
  const { data: spotlightData, error: spotlightError, isLoading: spotlightLoading } = useSWR("/api/spotlight/campaigns", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  });

  //Features users from API
  const { data: usersData, error: usersError, isLoading: usersLoading } = useSWR("/api/spotlight/users", fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: true,
  });





  // --- Search projects (only fetch on Search button click) ---
  const swrKey =
    query && query.trim()
      ? `/api/search_campaigns?q=${encodeURIComponent(query)}&page_size=3`
      : `/api/search_campaigns?sort=trending&page_size=3`; // default list

  const { data: searchData, error: searchError, isLoading: searchLoading } =
    useSWR(swrKey, fetcher, { refreshInterval: 60000, revalidateOnFocus: true });

  // Make mapper safe if data is not ready yet
  const searchedProjects = useMemo(
    () => mapSpotlightToFeatured(searchData?.items ?? []),
    [searchData]
  );
  const noResults = searchData?.total === 0;


  const featuredProjects = useMemo(() => mapSpotlightToFeatured(spotlightData?.items), [spotlightData]);
  const featuredUsers = usersData?.items || [];



  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <Badge className="w-fit" variant="secondary">
              Designed for Students · Driven by Community
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            <span className="block">Fuel Student Projects.</span>
            <span className="block text-primary">Fund Innovation.</span>
            <span className="block">Discover Talent.</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              CrowdX is the home for senior design and personal projects. Share what you're building, get support in crypto or cash, and put your skills in front of recruiters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2" onClick={() => router.push("/")}>
                <Rocket className="w-4 h-4" /> Start a Campaign
              </Button>
              <Button size="lg" variant="secondary" className="gap-2" onClick={() => router.push("/explore")}>
                <Users2 className="w-4 h-4" /> Explore Projects
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <Stat label="Active Projects" value= {stats?.active_projects}/>
              <Stat label="Funds Raised" value={`${stats?.funds_raised}k`}/>
              <Stat label="Active Creators" value= {stats?.active_creators} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" /> Project Spotlight
                </CardTitle>
                <CardDescription>Standout campaigns from across campuses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {featuredProjects.map((p) => (
                    <Link key={p.id} href={`/campaigns/${p.id}`} className="block">
                      <div className="p-4 rounded-2xl border bg-card hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{p.title}</div>
                            <div className="text-sm text-muted-foreground">{p.blurb}</div>
                          </div>
                          <Badge variant="secondary">{p.tags[0]}</Badge>
                        </div>
                        <div className="mt-3">
                          <ProgressBar value={Math.round((p.raised / p.goal) * 100)} />
                          <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                            <span>${p.raised.toLocaleString()} raised</span>
                            <span>${p.goal.toLocaleString()} goal</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button className="flex-1" onClick={() => router.push("/explore")}>
                    See All
                  </Button>
                </div>
                          </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Badge className="gap-1" variant="outline">
                  <Coins className="w-3.5 h-3.5" /> Crypto
                </Badge>
                <Badge className="gap-1" variant="outline">
                  <CreditCard className="w-3.5 h-3.5" /> Fiat
                </Badge>
                <Badge className="gap-1" variant="outline">
                  <Shield className="w-3.5 h-3.5" /> Secure
                </Badge>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" /> Showcase Your Build
                </CardTitle>
                <CardDescription>Post updates, demos, and current Progress</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Turn your senior design project into a living portfolio where the world can see what your working on.
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" /> Fund with Cash or Crypto
                </CardTitle>
                <CardDescription>Stripe + Blockchain ready</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Supporters can fuel your project with credit/debit cards or popular crypto wallets fast, easy, and secure.
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" /> Get Discovered by Recruiters
                </CardTitle>
                <CardDescription>Talent-first project profiles.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Your project deserves an audience. Let recruiters and peers see what you’ve created.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
            <div className="hidden md:flex items-center gap-2">
              <Input
                placeholder="Search projects, skills, tech…"
                className="w-72"
                value={projectSearch}
                onChange={e => setProjectSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {searchError && (
            <div className="text-red-500 text-sm mb-4">
              Couldn’t load featured projects.
            </div>
          )}

          {noResults && (
            <div className="text-sm text-muted-foreground mb-4">
              No matching results.
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {(searchLoading ? Array.from({ length: 3 }) : searchedProjects).map(
              (p, idx) =>
                searchLoading ? (
                  <div
                    key={idx}
                    className="rounded-2xl border p-6 animate-pulse h-48"
                  />
                ) : (
                  <ProjectCard key={`${p.id ?? p.title}-${idx}`} p={p} />
                )
            )}
          </div>

          <div className="mt-6 flex md:hidden items-center gap-2">
            <Input
              placeholder="Search projects, skills, tech…"
              value={projectSearch}
              onChange={e => setProjectSearch(e.target.value)}
            />
            <Button onClick={handleSearch} className="gap-2">
              <Search className="w-4 h-4" /> Search
            </Button>
          </div>
        </div>
      </section>


      {/* Recruiters hub */}
      <section id="recruiters" className="py-16 md:py-24 bg-muted/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                Recruiters Hub
              </Badge>
              <h3 className="text-3xl font-bold tracking-tight">
                Discover emerging talent by real shipped projects.
              </h3>
              <p className="text-muted-foreground">
                Browse by skills, technology, impact, and campus. Track progress, request interviews, and sponsor capstone teams.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {skillFilters.map((s) => (
                  <Badge key={s} variant="outline" className="rounded-full">
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="pt-4 flex gap-3">
                <Button className="gap-2" onClick={() => router.push("/")}>
                  <Search className="w-4 h-4" /> Explore Talent
                </Button>
                <Button variant="secondary" className="gap-2" onClick={() => router.push("/")}>
                  <Star className="w-4 h-4" /> Sponsor a Team
                </Button>
              </div>
            </div>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Candidate Spotlight
                </CardTitle>
                <CardDescription>Signal over noise—projects prove skills.</CardDescription>
              </CardHeader>

              {/* Loading */}
              {usersLoading && (
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border animate-pulse h-28" />
                  ))}
                </CardContent>
              )}

              {/* Error */}
              {usersError && !usersLoading && (
                <CardContent>
                  <div className="p-4 text-red-500 rounded-xl border border-red-200 bg-red-50">
                    Couldn’t load spotlight users.
                  </div>
                </CardContent>
              )}

              {/* Empty */}
              {!usersLoading && !usersError && featuredUsers.length === 0 && (
                <CardContent>
                  <div className="p-4 text-muted-foreground">No users to show yet.</div>
                </CardContent>
              )}

              {/* Success */}
              {!usersLoading && !usersError && featuredUsers.length > 0 && (
                // SpotlightUsers already renders its own <CardContent>
                <SpotlightUsers users={featuredUsers} />
                
              )}
              
            </Card>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="rounded-3xl border-primary/20 bg-primary/5">
            <CardContent className="py-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-2xl font-bold">Ready to launch your project?</h4>
                <p className="text-muted-foreground">
                  Create a campaign in minutes. Share progress. Get funded. Get noticed.
                </p>
              </div>
              <div className="flex gap-3">
                <Button size="lg" className="gap-2">
                  <Rocket className="w-4 h-4" /> Start a Campaign
                </Button>
                <Button size="lg" variant="secondary" className="gap-2">
                  <Coins className="w-4 h-4" /> Fund a Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h3>
            <p className="text-muted-foreground">
              Answers to common questions about payments, safety, and eligibility.
            </p>
          </div>
          <div className="space-y-4">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-base">How do payments work?</CardTitle>
                <CardDescription>Fiat via Stripe; crypto via online wallets.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-base">Who can launch a campaign?</CardTitle>
                <CardDescription>Current students and recent grads with verifiable projects.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-base">Is CrowdX safe?</CardTitle>
                <CardDescription>
                  We use escrow, milestone payouts, and project verification to reduce risk.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}
