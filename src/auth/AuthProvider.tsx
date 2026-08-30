import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { initializeCloudSync, stopCloudSync } from '../lib/cloudSync'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error'

type AuthContextValue = {
  user: User | null
  loading: boolean
  dataReady: boolean
  syncStatus: SyncStatus
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [dataReady, setDataReady] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')

  useEffect(() => {
    const client = supabase
    if (!client) {
      setLoading(false)
      return
    }

    const loadSession = async () => {
      const { data } = await client.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    void loadSession()
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) {
      stopCloudSync()
      setSyncStatus('idle')
      setDataReady(false)
      return
    }

    setDataReady(false)
    void initializeCloudSync(session.user.id, setSyncStatus).finally(() => setDataReady(true))
  }, [session?.user.id])

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user: session?.user ?? null,
      loading,
      dataReady,
      syncStatus,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden.')
  return context
}

export { isSupabaseConfigured }
