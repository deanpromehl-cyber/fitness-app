import { NavLink } from 'react-router-dom'

function BottomNav() {
  return (
    <nav className="bottom-nav">

      <NavLink to="/" end className="nav-item">
        <span>⌂</span>
        <small id="home">Home</small>
      </NavLink>

      <NavLink to="/workouts" className="nav-item">
        <span>💪</span>
        <small id="workouts">Workouts</small>
      </NavLink>

     

      <NavLink to="/stats" className="nav-item">
        <span>📊</span>
        <small id="stats">Stats</small>
      </NavLink>

      <NavLink to="/profile" className="nav-item">
        <span>👤</span>
        <small id="profile">Profile</small>
      </NavLink>

    </nav>
  )
}

export default BottomNav
