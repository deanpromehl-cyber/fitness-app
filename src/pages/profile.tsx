import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'

function Profile() {
  const { user, signOut, syncStatus } = useAuth()
  const username = user?.user_metadata.display_name || user?.email?.split('@')[0] || 'Sportler'
  const syncText = syncStatus === 'syncing' ? 'Synchronisiert…' : syncStatus === 'error' ? 'Synchronisierung fehlgeschlagen' : 'Cloud-Sync aktiv'
  const [bodyWeight, setBodyWeight] = useState('')

  useEffect(() => {
    const loadBodyWeight = () => {
      try {
        const settings = JSON.parse(localStorage.getItem('profileSettings') || '{}') as { bodyWeight?: number }
        setBodyWeight(settings.bodyWeight ? String(settings.bodyWeight) : '')
      } catch {
        setBodyWeight('')
      }
    }

    loadBodyWeight()
    window.addEventListener('cloudDataLoaded', loadBodyWeight)
    return () => window.removeEventListener('cloudDataLoaded', loadBodyWeight)
  }, [])

  const saveBodyWeight = () => {
    const value = Number(bodyWeight)
    localStorage.setItem('profileSettings', JSON.stringify({
      bodyWeight: Number.isFinite(value) && value > 0 ? value : null,
    }))
  }

  return (
    <div className="profile-page">
      <h1>Profil</h1>
      <section className="profile-card">
        <div className="profile-avatar">{username.charAt(0).toUpperCase()}</div>
        <div>
          <h2>{username}</h2>
          <p>{user?.email}</p>
        </div>
      </section>
      <section className="profile-card profile-bodyweight">
        <div>
          <h2>Körpergewicht</h2>
          <p>Wird bei Körpergewichtsübungen automatisch vorgeschlagen.</p>
        </div>
        <label>
          <input
            type="number"
            min="1"
            step="0.1"
            inputMode="decimal"
            placeholder="kg"
            value={bodyWeight}
            onChange={(event) => setBodyWeight(event.target.value)}
            onBlur={saveBodyWeight}
          />
          <span>kg</span>
        </label>
      </section>
      <section className="profile-card profile-settings">
        <div>
          <h2>Deine Daten</h2>
          <p className={syncStatus === 'error' ? 'sync-error' : ''}>{syncText}</p>
        </div>
        <button onClick={() => void signOut()}>Abmelden</button>
      </section>
    </div>
  )
}

export default Profile
