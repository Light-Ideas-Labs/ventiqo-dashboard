import { Ticket, Eye, CheckCircle2, Megaphone, type LucideIcon } from "lucide-react"

export const NOTIFICATION_ICONS_BY_TYPE: Record<string, LucideIcon> = {
  order: Ticket,
  booking: Ticket,
  payment: Ticket,
  event: CheckCircle2,
  update: CheckCircle2,
  promotion: Megaphone,
}

export function iconForNotificationType(type: string): LucideIcon {
  return NOTIFICATION_ICONS_BY_TYPE[type] ?? Eye
}
