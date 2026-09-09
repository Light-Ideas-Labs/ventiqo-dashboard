"use client"

import { useRef } from "react"
import { Image as ImageIcon, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { useUploadThing } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"

export default function CoverImageUpload({
  value,
  onChange,
  hint = "Recommended: 1200 x 675px (16:9)",
  className,
}: {
  value?: string
  onChange: (url: string) => void
  hint?: string
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const { startUpload, isUploading } = useUploadThing("eventImage", {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl ?? res?.[0]?.url
      if (url) onChange(url)
    },
    onUploadError: (error) => {
      toast.error("Upload failed", { description: error.message })
    },
  })

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    startUpload([files[0]])
  }

  if (value) {
    return (
      <div className={cn("group relative h-36 overflow-hidden rounded-lg border border-input", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote host isn't in next.config images */}
        <img src={value} alt="Cover" className="size-full object-cover" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={isUploading}
      className={cn(
        "flex h-36 w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-input text-center text-xs text-muted-foreground transition-colors hover:border-primary/50 disabled:opacity-60",
        className
      )}
    >
      {isUploading ? <Loader2 className="mb-1 size-5 animate-spin" /> : <ImageIcon className="mb-1 size-5" />}
      <span className="font-medium text-foreground">{isUploading ? "Uploading…" : "Upload Photo"}</span>
      <span>{hint}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </button>
  )
}
