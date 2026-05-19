function StatsCard({ title, value, text }) {

  return (

    <div className="card">

      <h3>{title}</h3>

      <p>{value}</p>

      <span>{text}</span>

    </div>

  )

}

export default StatsCard