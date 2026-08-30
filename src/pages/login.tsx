import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type Mode = 'login' | 'register' | 'reset' | 'update'

function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!supabase) return

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('update')
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return

    setSubmitting(true)
    setError('')
    setMessage('')

    if (mode === 'update') {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) setError(updateError.message)
      else {
        await supabase.auth.signOut()
        setMode('login')
        setMessage('Passwort geändert. Du kannst dich jetzt anmelden.')
      }
      setSubmitting(false)
      return
    }

    if (mode === 'reset') {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      })
      if (resetError) setError(resetError.message)
      else setMessage('Wenn ein Konto existiert, wurde dir eine E-Mail zum Zurücksetzen gesendet.')
      setSubmitting(false)
      return
    }

    if (mode === 'register') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName.trim() },
          emailRedirectTo: window.location.origin,
        },
      })
      if (signUpError) setError(signUpError.message)
      else if (!data.session) setMessage('Bitte bestätige jetzt deine E-Mail-Adresse. Danach kannst du dich anmelden.')
      else navigate('/')
      setSubmitting(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) setError('E-Mail oder Passwort ist nicht korrekt.')
    else navigate('/')
    setSubmitting(false)
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="auth-page">
        <section className="auth-card">
          <h1>Supabase verbinden</h1>
          <p>Lege zuerst die Datei <code>.env.local</code> an und trage deine Supabase-Projektwerte ein.</p>
        </section>
      </div>
    )
  }

  const title = mode === 'login' ? 'Willkommen zurück' : mode === 'register' ? 'Konto erstellen' : mode === 'reset' ? 'Passwort zurücksetzen' : 'Neues Passwort wählen'

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="auth-mark">💪</span>
        <h1>{title}</h1>
        <p>{mode === 'update' ? 'Lege ein neues Passwort für dein Konto fest.' : 'Dein Trainingsfortschritt wird sicher in deinem Account gespeichert.'}</p>

        {mode === 'register' && (
          <label>Benutzername
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required maxLength={40} />
          </label>
        )}
        {mode !== 'update' && <label>E-Mail-Adresse
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
        </label>}
        {mode !== 'reset' && (
          <label>{mode === 'update' ? 'Neues Passwort' : 'Passwort'}
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </label>
        )}

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}
        <button className="auth-submit" disabled={submitting}>{submitting ? 'Bitte warten…' : mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Konto erstellen' : mode === 'reset' ? 'E-Mail senden' : 'Passwort speichern'}</button>

        <div className="auth-actions">
          {mode === 'login' ? <><button type="button" onClick={() => setMode('register')}>Noch kein Konto? Registrieren</button><button type="button" onClick={() => setMode('reset')}>Passwort vergessen?</button></> : mode !== 'update' && <button type="button" onClick={() => setMode('login')}>Zurück zur Anmeldung</button>}
        </div>
      </form>
    </div>
  )
}

export default Login
