"use client"

import { toast } from "sonner"
import { Share2, Link as LinkIcon, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// There's no public per-event page yet (Phase 8), so this shares the
// organizer's own event-workspace URL — good enough for internal use,
// but callers should swap in the public URL once it exists.
export default function ShareEventMenu({ eventId }: { eventId: string }) {
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/organizer/events/${eventId}` : ""

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied")
    } catch {
      toast.error("Couldn't copy link")
    }
  }

  const shareTo = (platform: "whatsapp" | "facebook" | "twitter") => {
    const encoded = encodeURIComponent(shareUrl)
    const urls: Record<typeof platform, string> = {
      whatsapp: `https://wa.me/?text=${encoded}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      twitter: `https://twitter.com/intent/tweet?url=${encoded}`,
    }
    window.open(urls[platform], "_blank", "noopener,noreferrer")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="size-4" />
          Share event
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink}>
          <LinkIcon className="mr-2 size-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareTo("whatsapp")}>Share to WhatsApp</DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareTo("facebook")}>Share to Facebook</DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareTo("twitter")}>Share to Twitter</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast("Share-graphic download is coming soon")}>
          <Download className="mr-2 size-4" />
          Download share graphic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
