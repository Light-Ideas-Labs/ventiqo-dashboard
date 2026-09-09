import { LucideIcon } from "lucide-react"

export default function SidebarItem({
  icon: Icon,
  label,
  active,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition
      ${
        active
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </div>
  )
}