"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { hasPermission, isAdmin, type UserRole } from "@/types/user-roles"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredPermission?: string
  adminOnly?: boolean
  fallback?: React.ReactNode
}

export function RoleGuard({ children, requiredRole, requiredPermission, adminOnly = false, fallback }: RoleGuardProps) {
  const { userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!userRole) {
    return (
      fallback || (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>Authentication required to access this feature.</AlertDescription>
        </Alert>
      )
    )
  }

  // Check admin-only access
  if (adminOnly && !isAdmin(userRole)) {
    return (
      fallback || (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>Administrator privileges required to access this feature.</AlertDescription>
        </Alert>
      )
    )
  }

  // Check specific role requirement
  if (requiredRole && userRole > requiredRole) {
    return (
      fallback || (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>Higher subscription level required to access this feature.</AlertDescription>
        </Alert>
      )
    )
  }

  // Check specific permission
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return (
      fallback || (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>You don't have permission to access this feature.</AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
