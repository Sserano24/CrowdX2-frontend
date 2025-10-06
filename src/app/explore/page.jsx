"use client";

import React, { useState } from "react";
import {
  Search, Flame, Clock, Trophy, ChevronDown
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ExploreProjectCard from "../../components/ExploreProjectCard";
import useSWR from "swr";

// --- API fetcher ---
const fetcher = (url) =>
  fetch(url, { cache: "no-store" }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to fetch");
    return data;
  });

// Helper to map API response to ExploreProjectCard props
function mapProjectToExploreCard(p) {
  return {
    ...p,
    goal: p.goal_amount,
    raised: p.current_amount,
  };
}

export default function ExplorePage() {
  const [projectSearch, setProjectSearch] = useState("");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("trending");

  // Only search when Search button is clicked
  const handleSearch = () => setQuery(projectSearch.trim());

  // Build API URL
  const apiUrl =
    query && query.trim()
      ? `/api/search_campaigns?q=${encodeURIComponent(query)}&sort=${sortKey}&page_size=12`
      : `/api/search_campaigns?sort=${sortKey}&page_size=12`;

  const { data, error: searchError, isLoading: searchLoading } = useSWR(apiUrl, fetcher);

  const searchedProjects = data?.items || [];
  const noResults = !searchLoading && searchedProjects.length === 0;

  return (
    <section id="projects" className="py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Available Projects</h2>
            <p className="text-muted-foreground text-sm">
              Discover, search, and support student innovation.
            </p>
          </div>
          <form
            className="flex items-center gap-2 bg-muted rounded-full px-3 py-2 shadow-sm border border-muted-foreground/10 w-full md:w-auto"
            onSubmit={e => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search projects, skills, tech…"
              className="border-none bg-transparent focus:ring-0 focus-visible:ring-0 text-base"
              value={projectSearch}
              onChange={e => setProjectSearch(e.target.value)}
              style={{ minWidth: 180, width: "100%" }}
            />
            <Button
              type="submit"
              size="sm"
              className="rounded-full px-4"
              variant="default"
            >
              Search
            </Button>
          </form>
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
                <ExploreProjectCard key={`${p.id ?? p.title}-${idx}`} p={mapProjectToExploreCard(p)} />
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
  );
}
