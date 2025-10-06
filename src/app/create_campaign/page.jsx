"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  GraduationCap,
  Shield,
  Tag,
  Users2,
  Coins,
  CreditCard,
  Calendar,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

/* --------------------------------- Helpers -------------------------------- */
function formatMoney(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "$0";
  return x.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function ProgressBar({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Avatar({ name }) {
  const initials = (name || "—")
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className="size-9 rounded-full bg-muted grid place-items-center text-xs font-semibold text-muted-foreground">
      {initials || "—"}
    </div>
  );
}

/* ------------------------------ Default Values ---------------------------- */
const defaultC = {
  title: "",
  school: "",
  verified: false,
  is_sponsored: false,
  sponsored_by: "",
  description:
    "Describe what you’re building, why it matters, and how funds will be used. Include timelines and deliverables.",
  start_date: "",
  end_date: "",
  goal_amount: 5000,
  current_amount: 0,
  images: [],
  tags: [],
  milestones: [{ title: "Project Planning and Goal Definition", done: false }, { title: "First prototype", done: false }, { title: "Testing and feedback", done: false }, { title: "Final product launch", done: false }, { title: "Add more", done: false }],
  creator: { name: "" },
  team_members: [],
  // in defaultC
  allow_funding: false,
  allow_fiat: false,
  allow_crypto: false,
  fiat_processor: "Stripe",
  fiat_payout_email: "",
  crypto_chain: "Ethereum",
  crypto_wallet: "",

};

export default function CreateCampaignPage() {
  const [c, setC] = useState(defaultC);
  const [showPreview, setShowPreview] = useState(true);

  // --- derived state
  const pct = useMemo(() => {
    const goal = Math.max(1, Number(c.goal_amount) || 1);
    const cur = Math.max(0, Number(c.current_amount) || 0);
    return Math.min(100, Math.max(0, (cur / goal) * 100));
  }, [c.goal_amount, c.current_amount]);

  const isValid = useMemo(() => {
    const titleOk = (c.title || "").trim().length >= 3;
    const descOk = (c.description || "").trim().length >= 10;
    const goalOk = Number(c.goal_amount) > 0;
    return titleOk && descOk && goalOk;
  }, [c.title, c.description, c.goal_amount]);

  // --- update helpers
  function update(field, value) {
    setC((prev) => ({ ...prev, [field]: value }));
  }

  function updateNested(path, value) {
    // path like "creator.name"
    const keys = path.split(".");
    setC((prev) => {
      const next = { ...prev };
      let node = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        node[k] = Array.isArray(node[k]) ? [...node[k]] : { ...node[k] };
        node = node[k];
      }
      node[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function addListItem(listKey, item) {
    setC((prev) => ({ ...prev, [listKey]: [...(prev[listKey] || []), item] }));
  }

  function removeListItem(listKey, idx) {
    setC((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] || []).filter((_, i) => i !== idx),
    }));
  }

  function updateListItem(listKey, idx, value) {
    setC((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] || []).map((v, i) => (i === idx ? value : v)),
    }));
  }

  // --- events
  function onSubmit(e) {
    e.preventDefault();
    // TODO: wire to your API endpoint
    // await fetch("/api/campaigns", { method: "POST", body: JSON.stringify(c) })
    console.log("Create Campaign payload:", c);
    alert("Campaign draft submitted to console. Wire this up to your API.");
  }

  function addTagFromInput(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = (e.currentTarget.value || "").trim();
      if (val && !c.tags.includes(val)) {
        addListItem("tags", val);
      }
      e.currentTarget.value = "";
    }
  }

  // --- coercion helpers for number inputs (keeps state numeric)
  function numVal(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }


  {/* put this near the top of your component body */}
  const PROJECT_STAGES = [
    "Planning",
    "Building",
    "Prototype",
    "Testing",
    "Market",
    "Continuous Feedback",
  ];

  // get this from your auth layer (prop, hook, or context)
  const isUserVerified = typeof window !== "undefined" ? (window.__isUserVerified ?? false) : false;

  // keep c.verified in sync with the signed-in user's status
  React.useEffect(() => {
    update("verified", !!isUserVerified);
  }, [isUserVerified]);


  // Keep previews in c.images (object URLs) and raw files in c._imageFiles
  function addImagesFromFiles(fileList) {
    const max = 3 - (c.images?.length || 0);
    if (max <= 0) return;

    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/")).slice(0, max);

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    const nextImages = [...(c.images || []), ...newPreviews];
    const nextFiles = [...(c._imageFiles || []), ...files];

    setC((prev) => ({ ...prev, images: nextImages, _imageFiles: nextFiles }));
  }

  function removeImageAt(idx) {
    const prevUrl = c.images?.[idx];
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    setC((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx),
      _imageFiles: (prev._imageFiles || []).filter((_, i) => i !== idx),
    }));
  }

  // Optional: clean up object URLs on unmount
  React.useEffect(() => {
    return () => {
      (c.images || []).forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Header strip */}
      <section className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5" /> Create Campaign
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">New campaign</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Fill out details, add milestones, and preview live
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="gap-2" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide preview" : "Show preview"}
            </Button>
            <Button form="create-campaign-form" type="submit" className="gap-2" disabled={!isValid}>
              Publish draft
            </Button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <form id="create-campaign-form" onSubmit={onSubmit} className="lg:col-span-2 space-y-6" noValidate>
            {/* Basic Info */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Title, school, stage, and description</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Title / School / Stage */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Solar-Powered IoT Weather Station"
                      value={c.title}
                      onChange={(e) => update("title", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="school">School (optional)</Label>
                    <Input
                      id="school"
                      placeholder="e.g., CSUS"
                      value={c.school}
                      onChange={(e) => update("school", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="stage">Project stage</Label>
                    <select
                      id="stage"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                                ring-offset-background"
                      value={c.stage || ""}
                      onChange={(e) => update("stage", e.target.value)}
                    >
                      <option value="" disabled>Select a stage</option>
                      {PROJECT_STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Verified status (read-only, based on user) */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium inline-flex items-center gap-1">
                      <Shield className="w-4 h-4" /> Verification
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This campaign’s verification reflects the creator’s account status.
                    </p>
                  </div>
                  {isUserVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs rounded-full border px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-700 dark:text-emerald-300">
                      <Shield className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs rounded-full border px-2.5 py-1 text-muted-foreground">
                      <Shield className="w-3.5 h-3.5" /> Unverified
                    </span>
                  )}
                </div>

                {/* Sponsored controls (unchanged) */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium inline-flex items-center gap-1">
                      <Tag className="w-4 h-4" /> Sponsored
                    </div>
                    <p className="text-xs text-muted-foreground">Highlight with sponsor label and perks.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!c.is_sponsored}
                      onCheckedChange={(v) => update("is_sponsored", !!v)}
                    />
                    <Input
                      className="w-52"
                      placeholder="Sponsored by..."
                      value={c.sponsored_by}
                      onChange={(e) => update("sponsored_by", e.target.value)}
                      disabled={!c.is_sponsored}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={6}
                    placeholder="What are you building? Why now? How will you use funds? What are the milestones?"
                    value={c.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>


            {/* Media */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Upload up to 3 images</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Dropzone + File input */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    addImagesFromFiles(e.dataTransfer.files);
                  }}
                  className="rounded-lg border border-dashed p-6 text-center"
                >
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addImagesFromFiles(e.currentTarget.files)}
                  />
                  <label htmlFor="images" className="block cursor-pointer">
                    <div className="text-sm text-muted-foreground">
                      Drag & drop images here, or <span className="underline">browse</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {`${(c.images?.length || 0)}/3 selected`}
                    </div>
                  </label>
                </div>

                {/* Previews */}
                {(c.images || []).length > 0 ? (
                  <div className="grid grid-cols-12 gap-3">
                    {/* Cover */}
                    <div className="col-span-12 md:col-span-8 relative overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.images[0]} alt="Cover preview" className="w-full h-[320px] object-cover" />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImageAt(0)}
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Thumbs */}
                    <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-3">
                      {c.images.slice(1, 3).map((src, i) => (
                        <div key={i} className="relative overflow-hidden rounded-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Preview ${i + 2}`} className="w-full h-[158px] object-cover" />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeImageAt(i + 1)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-40 grid place-items-center text-muted-foreground text-sm">
                    No images uploaded yet.
                  </div>
                )}

                {/* Add more button */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Recommended: 1600×900 JPG/PNG, &lt; 5MB each
                  </div>
                  <label htmlFor="images">
                    <Button
                      type="button"
                      variant="secondary"
                      className="gap-2"
                      disabled={(c.images?.length || 0) >= 3}
                    >
                      <Plus className="w-4 h-4" /> Add images
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>


            {/* Tags & Dates */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Tags & Dates</CardTitle>
                <CardDescription>Improve discoverability and set your timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tags</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(c.tags || []).map((t, i) => (
                      <Badge key={`${t}-${i}`} variant="outline" className="gap-1">
                        {t}
                        <button
                          type="button"
                          className="ml-1 text-muted-foreground"
                          onClick={() => removeListItem("tags", i)}
                          aria-label="Remove tag"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input className="mt-2" placeholder="Type a tag and press Enter" onKeyDown={addTagFromInput} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={c.start_date}
                      onChange={(e) => update("start_date", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End date</Label>
                    <Input id="end_date" type="date" value={c.end_date} onChange={(e) => update("end_date", e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funding */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Funding</CardTitle>
                <CardDescription>Optionally enable funding and choose payment methods</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Master toggle */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Allow funding</div>
                    <p className="text-xs text-muted-foreground">
                      Turn on to set a goal and accept contributions.
                    </p>
                  </div>
                  <Switch
                    checked={!!c.allow_funding}
                    onCheckedChange={(v) => update("allow_funding", !!v)}
                  />
                </div>

                {/* When funding is enabled, show configuration */}
                {c.allow_funding ? (
                  <>
                    {/* Goal & current */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="goal_amount">Goal (USD)</Label>
                        <Input
                          id="goal_amount"
                          type="number"
                          min={1}
                          step={1}
                          value={c.goal_amount}
                          onChange={(e) => update("goal_amount", numVal(e.target.value, 1))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="current_amount">Current raised (USD)</Label>
                        <Input
                          id="current_amount"
                          type="number"
                          min={0}
                          step={1}
                          value={c.current_amount}
                          onChange={(e) => update("current_amount", numVal(e.target.value, 0))}
                        />
                      </div>
                    </div>

                    {/* Method toggles */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Credit/Debit */}
                      <div className="rounded-lg border p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Credit / Debit</div>
                            <p className="text-xs text-muted-foreground">
                              Accept cards via a payment processor.
                            </p>
                          </div>
                          <Switch
                            checked={!!c.allow_fiat}
                            onCheckedChange={(v) => update("allow_fiat", !!v)}
                          />
                        </div>

                        {c.allow_fiat && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="fiat_processor">Processor</Label>
                              <select
                                id="fiat_processor"
                                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm
                                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                                          ring-offset-background"
                                value={c.fiat_processor || "Stripe"}
                                onChange={(e) => update("fiat_processor", e.target.value)}
                              >
                                <option value="Stripe">Stripe</option>
                                <option value="Square">Square</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div>
                              <Label htmlFor="fiat_payout_email">Payout email (for settlements)</Label>
                              <Input
                                id="fiat_payout_email"
                                type="email"
                                placeholder="you@example.com"
                                value={c.fiat_payout_email}
                                onChange={(e) => update("fiat_payout_email", e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Crypto */}
                      <div className="rounded-lg border p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Crypto</div>
                            <p className="text-xs text-muted-foreground">
                              Accept crypto to a wallet you control.
                            </p>
                          </div>
                          <Switch
                            checked={!!c.allow_crypto}
                            onCheckedChange={(v) => update("allow_crypto", !!v)}
                          />
                        </div>

                        {c.allow_crypto && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="crypto_chain">Network</Label>
                              <select
                                id="crypto_chain"
                                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm
                                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                                          ring-offset-background"
                                value={c.crypto_chain || "Ethereum"}
                                onChange={(e) => update("crypto_chain", e.target.value)}
                              >
                                <option value="Ethereum">Ethereum</option>
                                <option value="Solana">Solana</option>
                                <option value="Polygon">Polygon</option>
                                <option value="Base">Base</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>

                            <div>
                              <Label htmlFor="crypto_wallet">Wallet address</Label>
                              <Input
                                id="crypto_wallet"
                                placeholder="0x… or wallet address"
                                value={c.crypto_wallet}
                                onChange={(e) => update("crypto_wallet", e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                    Funding is currently <span className="font-medium">disabled</span>. Turn it on to set a goal
                    and choose payment methods.
                  </div>
                )}
              </CardContent>
            </Card>


            {/* Milestones */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>Break work into clear deliverables for staged payouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Milestones</Label>
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => addListItem("milestones", { title: "", done: false })}
                  >
                    <Plus className="w-4 h-4" /> Add milestone
                  </Button>
                </div>

                <div className="space-y-2">
                  {(c.milestones || []).map((m, i) => (
                    <div key={`m-${i}`} className="flex items-center gap-3 rounded-lg border p-3">
                      <Button
                        type="button"
                        variant={m.done ? "default" : "outline"}
                        size="sm"
                        aria-pressed={m.done}
                        onClick={() =>
                          updateListItem("milestones", i, { ...m, done: !m.done })
                        }
                        className="gap-1"
                      >
                        {m.done ? "Done" : "Mark Done"}
                      </Button>

                      <Input
                        placeholder={`Milestone ${i + 1} title`}
                        value={m.title}
                        onChange={(e) =>
                          updateListItem("milestones", i, { ...m, title: e.target.value })
                        }
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem("milestones", i)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Creators & Team</CardTitle>
                <CardDescription>Who’s building this?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="creator_name">Creator name</Label>
                  <Input
                    id="creator_name"
                    placeholder="Your name"
                    value={c.creator?.name || ""}
                    onChange={(e) => updateNested("creator.name", e.target.value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Team members</Label>
                  <Button type="button" variant="secondary" className="gap-2" onClick={() => addListItem("team_members", { name: "" })}>
                    <Plus className="w-4 h-4" /> Add member
                  </Button>
                </div>
                <div className="space-y-2">
                  {(c.team_members || []).map((m, i) => (
                    <div key={`t-${i}`} className="flex items-center gap-3">
                      <Input
                        placeholder="Full name"
                        value={m.name}
                        onChange={(e) => updateListItem("team_members", i, { ...m, name: e.target.value })}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem("team_members", i)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" className="gap-2" disabled={!isValid}>
                <CreditCard className="w-4 h-4" /> Save & Publish
              </Button>
              <Button type="button" variant="secondary" onClick={() => console.log("Save draft:", c)}>
                Save draft
              </Button>
              <Button type="button" variant="ghost" onClick={() => setC(defaultC)}>
                Reset
              </Button>
            </div>
          </form>

          {/* Right: Live Preview */}
          <div className="lg:col-span-1 space-y-6">
            {showPreview && (
              <>
                {/* Funding preview */}
                <Card className="rounded-2xl border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle>Fund this project</CardTitle>
                    <CardDescription>Milestone-based payouts. Transparent updates.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ProgressBar value={pct} />
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{formatMoney(Number(c.current_amount))} raised</span>
                      <span className="text-muted-foreground">of {formatMoney(Number(c.goal_amount))} goal</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button className="gap-2" disabled>
                        <CreditCard className="w-4 h-4" /> Fund (Fiat)
                      </Button>
                      <Button variant="secondary" className="gap-2" disabled>
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

                {/* Team preview */}
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users2 className="w-5 h-5" /> Creators & Team
                    </CardTitle>
                    <CardDescription>People behind the project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Creator</div>
                      <div className="flex items-center gap-3">
                        <Avatar name={c.creator?.name} />
                        <div className="text-sm">
                          <div className="font-medium">{c.creator?.name || "—"}</div>
                          <div className="text-muted-foreground">Project lead</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Team Members</div>
                      {Array.isArray(c.team_members) && c.team_members.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {c.team_members.map((m, idx) => (
                            <div key={`${m.name}-${idx}`} className="flex items-center gap-3">
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

                {/* Safety */}
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" /> Safety & Transparency
                    </CardTitle>
                    <CardDescription>How funds are handled</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                      Funds are held in escrow and released by milestones. Backers see updates and deliverables before each
                      release.
                    </p>
                    <p>Projects may be verified through campus or partner checks.</p>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Compact title strip preview */}
            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5" /> Campaign
                </div>
                <h2 className="text-xl font-bold">{c.title || "Your campaign title"}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <GraduationCap className="w-3.5 h-3.5" /> {c.school || "—"}
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gallery & About preview (full-width below on small screens) */}
        <div className="max-w-6xl mx-auto px-4 mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                {Array.isArray(c.images) && c.images.length > 0 ? (
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-8 overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.images[0]} alt={`${c.title} image 1`} className="w-full h-[320px] object-cover" />
                    </div>
                    <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-3">
                      {c.images.slice(1, 3).map((src, i) => (
                        <div key={i} className="overflow-hidden rounded-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
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

                {Array.isArray(c.tags) && c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {c.tags.map((t, i) => (
                      <Badge key={`${t}-${i}`} variant="outline" className="rounded-full">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

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
                    <div key={`mm-${i}`} className="flex items-center gap-3">
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

          {/* Right: Funding + Team (already shown above in preview) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mirrors the preview card so creators see the same layout */}
            <Card className="rounded-2xl border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Fund this project</CardTitle>
                <CardDescription>Milestone-based payouts. Transparent updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProgressBar value={pct} />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{formatMoney(Number(c.current_amount))} raised</span>
                  <span className="text-muted-foreground">of {formatMoney(Number(c.goal_amount))} goal</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button className="gap-2" disabled>
                    <CreditCard className="w-4 h-4" /> Fund (Fiat)
                  </Button>
                  <Button variant="secondary" className="gap-2" disabled>
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

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="w-5 h-5" /> Creators & Team
                </CardTitle>
                <CardDescription>People behind the project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Creator</div>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.creator?.name} />
                    <div className="text-sm">
                      <div className="font-medium">{c.creator?.name || "—"}</div>
                      <div className="text-muted-foreground">Project lead</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Team Members</div>
                  {Array.isArray(c.team_members) && c.team_members.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {c.team_members.map((m, i) => (
                        <div key={`tt-${i}`} className="flex items-center gap-3">
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
