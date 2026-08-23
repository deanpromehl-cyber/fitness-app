function Home() {
  return (
    <div className="home">
      <div className="homenumbers">

        <p>Workouts: 0</p>
        <p>Lifted: 0 kg</p>
        <p>Time: 0 hours</p>

      </div>
    <div className="trophies">


    </div>

  <div className="maintraining">

    <button className="starttraining">Start Training</button>

    <select className="workout-select">
    <option value="">Workout auswählen</option>
    <option value="push">Push Day</option>
    <option value="pull">Pull Day</option>
    <option value="legs">Leg Day</option>
  </select>



  </div> 


<div className="recent-workouts">

  <h2>Letzte Workouts</h2>

  <div className="workout-history">

    <div className="workout-history-item">
      <div>
        <p className="workout-date">23.08.2026</p>
        <h3>Push Day</h3>
      </div>

      <div className="workout-stats">
        <span>45 min</span>
        <span>7.250 kg</span>
      </div>
    </div>


    <div className="workout-history-item">
      <div>
        <p className="workout-date">21.08.2026</p>
        <h3>Leg Day</h3>
      </div>

      <div className="workout-stats">
        <span>52 min</span>
        <span>9.800 kg</span>
      </div>
    </div>


    <div className="workout-history-item">
      <div>
        <p className="workout-date">19.08.2026</p>
        <h3>Pull Day</h3>
      </div>

      <div className="workout-stats">
        <span>41 min</span>
        <span>6.450 kg</span>
      </div>
    </div>

  </div>

</div>


<div className="monthly-stats">

  <h2>Dieser Monat</h2>

  <div className="monthly-stats-box">

    <div>
      <span>Workouts</span>
      <strong>12</strong>
    </div>

    <div>
      <span>Time</span>
      <strong>8,5 h</strong>
    </div>

    <div>
      <span>Gewicht</span>
      <strong>72.450 kg</strong>
    </div>

  </div>

</div>








    </div>                      
  )
}

export default Home