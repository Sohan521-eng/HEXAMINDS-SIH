"use client";

import React from "react";
import Link from "next/link";
import { User, Building, Mail, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  return (
    <Card variant="glass" className="p-8 space-y-5">
      <div className="text-center pb-2 border-b border-[#1E3252]">
        <h2 className="text-lg font-bold text-white">Agency Registration</h2>
        <p className="text-xs text-[#8E9EB5]">Request authorized access to live satellite feeds</p>
      </div>

      <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Dr. Rajesh Sharma"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#050B14] border border-[#1E3252] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00F2FE]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">Agency / Organization</label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="IMD / National Disaster Response Force"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#050B14] border border-[#1E3252] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00F2FE]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">Institutional Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="r.sharma@imd.gov.in"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#050B14] border border-[#1E3252] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00F2FE]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#050B14] border border-[#1E3252] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00F2FE]"
            />
          </div>
        </div>

        <Link href="/dashboard" className="block pt-2">
          <Button variant="primary" size="lg" className="w-full py-2.5">
            Submit for Verification
          </Button>
        </Link>
      </form>

      <div className="pt-2 text-center text-xs text-[#8E9EB5]">
        Already verified?{" "}
        <Link href="/login" className="text-[#00F2FE] hover:underline font-bold">
          Sign In
        </Link>
      </div>
    </Card>
  );
}
