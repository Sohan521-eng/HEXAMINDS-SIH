import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050B14] text-white flex flex-col justify-center items-center p-6 pt-20 sm:pt-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#00F2FE]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-6 z-10 space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 mb-1 group">
          <Image 
            src="/logo.png" 
            alt="CYTORN Logo" 
            width={72} 
            height={72} 
            unoptimized
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain translate-y-0.5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] drop-shadow-[0_0_12px_rgba(0,242,254,0.4)] group-hover:scale-105 transition-transform shrink-0"
            priority
          />
          <span className="text-3xl font-black tracking-tight text-white">CYTORN</span>
        </Link>
        <p className="text-xs font-mono text-[#8E9EB5]">
          SECURE OPERATIONAL ACCESS • MINISTRY OF EARTH SCIENCES
        </p>
      </div>

      <div className="w-full max-w-md z-10">
        {children}
      </div>

      <div className="mt-8 text-center text-xs font-mono text-slate-500 z-10">
        CYTORN TACTICAL GATEWAY • 256-BIT ENCRYPTION
      </div>
    </div>
  );
}
