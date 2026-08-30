import { useAuth } from '../auth/AuthProvider'

function Profile() {
  const { user, signOut, syncStatus } = useAuth()
  const username = user?.user_metadata.display_name || user?.email?.split('@')[0] || 'Sportler'
  const syncText = syncStatus === 'syncing' ? 'Synchronisiert…' : syncStatus === 'error' ? 'Synchronisierung fehlgeschlagen' : 'Cloud-Sync aktiv'

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
