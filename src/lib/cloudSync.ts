import { supabase } from './supabase'

const syncedKeys = [
  'workouts',
  'trainingHistory',
  'unlockedAchievements',
  'selectedAchievements',
  'activeTraining',
] as const

type SyncedKey = (typeof syncedKeys)[number]
type Snapshot = Partial<Record<SyncedKey, unknown>>
type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error'

let currentUserId: string | null = null
let isRestoring = false
let saveTimer: number | undefined
let storagePatched = false
let statusCallback: ((status: SyncStatus) => void) | null = null

function setStatus(status: SyncStatus) {
  statusCallback?.(status)
}

function snapshotFromBrowser(): Snapshot {
  return syncedKeys.reduce<Snapshot>((snapshot, key) => {
    const value = localStorage.getItem(key)
    if (value === null) return snapshot

    try {
      snapshot[key] = JSON.parse(value) as unknown
    } catch {
      snapshot[key] = value
    }

    return snapshot
  }, {})
}

function restoreSnapshot(snapshot: Snapshot) {
  isRestoring = true

  try {
    syncedKeys.forEach((key) => {
      const value = snapshot[key]
      if (value === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
    })
  } finally {
    isRestoring = false
  }

  window.dispatchEvent(new Event('cloudDataLoaded'))
}

export async function saveCloudData() {
  if (!supabase || !currentUserId || isRestoring) return

  setStatus('syncing')
  const { error } = await supabase.from('user_data').upsert({
    user_id: currentUserId,
    data: snapshotFromBrowser(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Cloud-Synchronisierung fehlgeschlagen:', error.message)
    setStatus('error')
    return
  }

  setStatus('saved')
}

function scheduleSave() {
  if (!currentUserId || isRestoring) return
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => void saveCloudData(), 700)
}

function patchStorage() {
  if (storagePatched) return
  storagePatched = true

  const originalSetItem = Storage.prototype.setItem
  const originalRemoveItem = Storage.prototype.removeItem

  Storage.prototype.setItem = function setItem(key: string, value: string) {
    originalSetItem.call(this, key, value)
    if (this === localStorage && syncedKeys.includes(key as SyncedKey)) scheduleSave()
  }

  Storage.prototype.removeItem = function removeItem(key: string) {
    originalRemoveItem.call(this, key)
    if (this === localStorage && syncedKeys.includes(key as SyncedKey)) scheduleSave()
  }
}

export async function initializeCloudSync(
  userId: string,
  onStatus: (status: SyncStatus) => void,
) {
  if (!supabase) return

  currentUserId = userId
  statusCallback = onStatus
  patchStorage()
  setStatus('syncing')

  const { data, error } = await supabase
    .from('user_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Cloud-Daten konnten nicht geladen werden:', error.message)
    setStatus('error')
    return
  }

  if (data?.data) {
    restoreSnapshot(data.data as Snapshot)
    setStatus('saved')
    return
  }

  // First sign-in: migrate the app's existing browser data to the new account.
  await saveCloudData()
}

export function stopCloudSync() {
  window.clearTimeout(saveTimer)
  currentUserId = null
  statusCallback = null
}
