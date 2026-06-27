import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ADMIN_EMAILS } from '../../utils/constants'

export default function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
