import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'

import Header from './components/header'
import Home from './pages/home'
import Workouts from './pages/workouts'
import Stats from './pages/stats'
import Profile from './pages/profile'
import BottomNav from './components/bottomnav'
import CreateWorkout from './pages/createworkout'
import WorkoutDetail from './pages/workoutdetail'
import Training from './pages/training'
import StatsHistory from './pages/statshistory'
import StatsTrainingDetail from './pages/statstrainingdetail'
import StatsPersonalRecords from './pages/statspersonalrecords'
import StatsExerciseProgress from './pages/statsexerciseprogress'
import StatsExerciseDetail from './pages/statsexercisedetail'
import StatsMuscleGroups from './pages/statsmusclegroups'
import StatsAverages from './pages/statsaverages'
import StatsCalendar from './pages/statscalendar'
import Achievements from './pages/achievements'
import Login from './pages/login'
import { AuthProvider, isSupabaseConfigured, useAuth } from './auth/AuthProvider'

function ProtectedApp() {
  const { loading, dataReady, user } = useAuth()

  if (loading || (user && !dataReady)) return <div className="app-loading">Lade dein Trainingskonto…</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-workout" element={<CreateWorkout />} />
          <Route path="/workouts/:id" element={<WorkoutDetail />} />
          <Route path="/training/:id" element={<Training />} />
          <Route path="/stats/history" element={<StatsHistory />} />
          <Route path="/stats/history/:id" element={<StatsTrainingDetail />} />
          <Route path="/stats/personal-records" element={<StatsPersonalRecords />} />
          <Route path="/stats/exercise-progress" element={<StatsExerciseProgress />} />
          <Route path="/stats/exercise-progress/:exerciseName" element={<StatsExerciseDetail />} />
          <Route path="/stats/muscle-groups" element={<StatsMuscleGroups />} />
          <Route path="/stats/averages" element={<StatsAverages />} />
          <Route path="/stats/calendar" element={<StatsCalendar />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={isSupabaseConfigured ? <ProtectedApp /> : <Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
