import { BrowserRouter, Routes, Route } from 'react-router-dom'

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

function App() {
  return (
    <BrowserRouter>
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

          </Routes>
        </main>

        <BottomNav />

      </div>
    </BrowserRouter>
  )
}

export default App