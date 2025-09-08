// components/ExploreProjectCard.jsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Shield,
  Tag as TagIcon,
  Users,
  CalendarClock,
  Coins,
  CreditCard,
  ArrowRight,
} from "lucide-react";

// Thicker progress bar for visual pop
function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, value ?? 0));
  return (
    <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full bg-primary transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function formatMoney(n) {
  const x = Number(n || 0);
  if (x >= 1_000_000) return `$${(x / 1_000_000).toFixed(1)}M`;
  if (x >= 1_000) return `$${(x / 1_000).toFixed(1)}k`;
  return `$${x.toLocaleString()}`;
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs">
      <Icon className="w-3.5 h-3.5" />
      <span className="font-medium">{value}</span>
      <span className="text-muted-foreground">• {label}</span>
    </div>
  );
}

export default function ExploreProjectCard({ p }) {
  const cover =
    p?.cover || (Array.isArray(p?.images) && p.images.length ? p.images[0] : "");
  const pct =
    p?.goal > 0 ? Math.round((Number(p?.raised) / Number(p?.goal)) * 100) : 0;
  const href = p?.slug ? `/campaigns/${p.slug}` : `/campaigns/${p?.id}`;

  return (
    <Card className="group overflow-hidden rounded-3xl border-none shadow-md hover:shadow-xl transition-shadow">
      {/* Cover */}
      <div className="relative aspect-[16/9]">
        {cover ? (
          <img
            src={cover}
            alt={`${p?.title || "Project"} cover`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-muted text-muted-foreground">
            No image
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          {p?.school ? (
            <Badge variant="secondary" className="gap-1 backdrop-blur bg-white/90">
              <GraduationCap className="w-3.5 h-3.5" />
              {p.school}
            </Badge>
          ) : null}
          {p?.verified ? (
            <Badge variant="outline" className="gap-1 bg-white/80">
              <Shield className="w-3.5 h-3.5" /> Verified
            </Badge>
          ) : null}
          {p?.is_sponsored ? (
            <Badge className="gap-1 bg-primary/90">
              <TagIcon className="w-3.5 h-3.5" />
              Sponsored{p?.sponsored_by ? ` by ${p.sponsored_by}` : ""}
            </Badge>
          ) : null}
        </div>

        {/* Title */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-xl md:text-2xl font-semibold drop-shadow-sm">
            {p?.title}
          </h3>
        </div>

        {/* Clickable overlay */}
        <Link href={href} className="absolute inset-0" aria-label={`View ${p?.title}`} />
      </div>

      {/* Content */}
      <CardContent className="p-5 md:p-6 space-y-4">
        {/* Blurb */}
        {p?.blurb || p?.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {p.blurb || p.description}
          </p>
        ) : null}

        {/* Tags */}
        {Array.isArray(p?.tags) && p.tags.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {p.tags.slice(0, 6).map((t) => (
              <Badge key={t} variant="outline" className="rounded-full whitespace-nowrap">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Progress + numbers */}
        <div className="space-y-2">
          <ProgressBar value={pct} />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{formatMoney(p?.raised)} raised</span>
            <span className="text-muted-foreground">
              of {formatMoney(p?.goal)} goal
            </span>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <StatPill icon={Users} label="Backers" value={(p?.backers ?? 0).toLocaleString()} />
          <StatPill icon={CalendarClock} label="Days left" value={String(p?.days_left ?? 0)} />
        </div>
      </CardContent>

      {/* Footer actions */}
      <CardFooter className="p-5 pt-0 md:px-6">
        <Button asChild className="w-full gap-2">
            <Link href={href}>
            View Project <ArrowRight className="w-4 h-4" />
            </Link>
        </Button>
        </CardFooter>
    </Card>
  );
}
