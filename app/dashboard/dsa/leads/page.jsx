"use client";

import React from "react";
import LeadTableNew from "@/components/Lead/LeadTableNew";

export default function DSALeadsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">DSA Leads</p>
        <h1 className="text-3xl font-black text-slate-900 mt-2">My Leads</h1>
        <p className="text-slate-500 mt-2">View and manage the leads you created.</p>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <LeadTableNew />
      </div>
    </div>
  );
}
