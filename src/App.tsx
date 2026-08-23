import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/header'
import Home from './pages/home'
import Workouts from './pages/workouts'
import Stats from './pages/stats'
import Profile from './pages/profile'
import BottomNav from './components/bottomnav'

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
          </Routes>
        </main>

        <BottomNav />

      </div>
    </BrowserRouter>
  )
}

export default App