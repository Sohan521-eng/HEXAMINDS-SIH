"use client";

import React, { useState } from "react";
import { UploadCloud, FileType, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ImageUploader({ onImageSelect }: { onImageSelect?: (file: File) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) {
          setSelectedFile(files[0].name);
          onImageSelect?.(files[0]);
        }
      }}
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
        dragOver
          ? "border-[#00F2FE] bg-[#00F2FE]/10"
          : "border-[#1E3252] bg-[#050B14]/60 hover:border-[#00F2FE]/40"
      }`}
    >
      <div className="w-12 h-12 rounded-full border border-[#00F2FE]/30 flex items-center justify-center bg-[#00F2FE]/10 mx-auto mb-3 text-[#00F2FE]">
        <UploadCloud className="w-6 h-6" />
      </div>

      <p className="text-xs font-bold text-white mb-1">
        Drag and drop satellite raster or HDF5 imagery
      </p>
      <p className="text-[11px] font-mono text-[#8E9EB5] mb-3">
        Supports INSAT-3DR HDF5, GeoTIFF, NetCDF, and PNG
      </p>

      {selectedFile ? (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00F2FE]/10 text-[#00F2FE] text-xs font-mono mb-3">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{selectedFile}</span>
        </div>
      ) : null}

      <div>
        <Button variant="secondary" size="sm">
          Browse Local Files
        </Button>
      </div>
    </div>
  );
}
