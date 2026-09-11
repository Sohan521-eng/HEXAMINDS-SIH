"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Satellite, Shield, User, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"scientist" | "disaster" | "public">("scientist");

  return (
    <Card variant="glass" className="p-8 space-y-6">
      {/* Role Selector */}
      <div>
        <label className="text-[11px] font-mono uppercase tracking-wider text-[#8E9EB5] block mb-2">
          Select Operational Role
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedRole("scientist")}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              selectedRole === "scientist"
                ? "bg-[#00F2FE]/15 border-[#00F2FE] text-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.2)]"
                : "bg-[#050B14] border-[#1E3252] text-slate-400 hover:text-white"
            }`}
          >
            <Satellite className="w-4 h-4 mx-auto mb-1" />
            <span className="text-[10px] font-bold block">Scientist</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("disaster")}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              selectedRole === "disaster"
                ? "bg-[#FF5E36]/15 border-[#FF5E36] text-[#FF5E36] shadow-[0_0_12px_rgba(255,94,54,0.2)]"
                : "bg-[#050B14] border-[#1E3252] text-slate-400 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4 mx-auto mb-1" />
            <span className="text-[10px] font-bold block">NDMA/SDMA</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("public")}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              selectedRole === "public"
                ? "bg-slate-700/40 border-slate-500 text-white"
                : "bg-[#050B14] border-[#1E3252] text-slate-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4 mx-auto mb-1" />
            <span className="text-[10px] font-bold block">Public</span>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">
            Official Email / Agency ID
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="officer@imd.gov.in"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#050B14] border border-[#1E3252] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00F2FE]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-300">Security Credential</label>
            <a href="#" className="text-[11px] text-[#00F2FE] hover:underline">
              Forgot key?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#050B14] border border-[#1E3252] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00F2FE]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Link href="/dashboard" className="block pt-2">
          <Button variant="primary" size="lg" className="w-full py-3">
            Authenticate Session
          </Button>
        </Link>
      </form>

      <div className="pt-2 text-center text-xs text-[#8E9EB5]">
        Need access credentials?{" "}
        <Link href="/register" className="text-[#00F2FE] hover:underline font-bold">
          Request Agency Verification
        </Link>
      </div>
    </Card>
  );
}
