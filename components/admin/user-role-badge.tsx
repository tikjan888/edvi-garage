"use client"

import { Badge } from "@/components/ui/badge"
import { Crown, Star, Zap, Shield } from "lucide-react"
import { USER_ROLES, type UserRole } from "@/types/user-roles"

interface UserRoleBadgeProps {
  role: UserRole
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

export function UserRoleBadge({ role, showIcon = true, size = "md" }: UserRoleBadgeProps) {
  const roleInfo = USER_ROLES[role]

  const getRoleIcon = () => {
    switch (role) {
      case 1:
        return <Crown className="h-3 w-3" />
      case 2:
        return <Star className="h-3 w-3" />
      case 3:
        return <Zap className="h-3 w-3" />
      case 4:
        return <Shield className="h-3 w-3" />
      default:
        return <Star className="h-3 w-3" />
    }
  }

  const getBadgeColor = () => {
    switch (role) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-200"
      case 3:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case 4:
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5"
      case "lg":
        return "text-sm px-3 py-1"
      default:
        return "text-xs px-2 py-1"
    }
  }

  return (
    <Badge className={`${getBadgeColor()} ${getSizeClass()}`}>
      <div className="flex items-center gap-1">
        {showIcon && getRoleIcon()}
        {roleInfo.roleName}
      </div>
    </Badge>
  )
}
