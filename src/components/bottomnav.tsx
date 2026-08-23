import { Link } from 'react-router-dom'

function BottomNav() {
  return (
    <nav className="bottom-nav">

      <Link to="/" className="nav-item">
        <span>⌂</span>
        <small id="home">Home</small>
      </Link>

      <Link to="/workouts" className="nav-item">
        <span>💪</span>
        <small id="workouts">Workouts</small>
      </Link>

     

      <Link to="/stats" className="nav-item">
        <span>📊</span>
        <small id="stats">Stats</small>
      </Link>

      <Link to="/profile" className="nav-item">
        <span>👤</span>
        <small id="profile">Profile</small>
      </Link>

    </nav>
  )
}

export default BottomNav