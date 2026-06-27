import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // undefined = sedang load | null = belum login | object = sudah login
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // Ambil session yang sudah ada saat app pertama kali load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null)
    })

    // Listen perubahan auth (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, signOut, loading: session === undefined }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
