"use client";

import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        {/* Logo + Description */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 grid place-items-center rounded-xl bg-primary/10">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight">CrowdX</span>
          </div>
          <p className="text-muted-foreground">
            Where student projects meet support, visibility, and opportunity.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <div className="font-semibold mb-2">Product</div>
          <ul className="space-y-1 text-muted-foreground">
            <li className="hover:text-primary cursor-pointer">Features</li>
            <li className="hover:text-primary cursor-pointer">Pricing</li>
            <li className="hover:text-primary cursor-pointer">Security</li>
          </ul>
        </div>

        {/* Recruiter Links */}
        <div>
          <div className="font-semibold mb-2">For Recruiters</div>
          <ul className="space-y-1 text-muted-foreground">
            <li className="hover:text-primary cursor-pointer">Browse Talent</li>
            <li className="hover:text-primary cursor-pointer">Sponsor Teams</li>
            <li className="hover:text-primary cursor-pointer">Campus Partnerships</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-xs text-muted-foreground pb-8 text-center">
        © {new Date().getFullYear()} CrowdX. All rights reserved.
      </div>
    </footer>
  );
}
