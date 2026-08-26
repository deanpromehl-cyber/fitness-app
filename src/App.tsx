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

          </Routes>
        </main>

        <BottomNav />

      </div>
    </BrowserRouter>
  )
}

export default App