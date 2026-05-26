function Planner(){

  return (

    <div
      style={{
        background:"#0f172a",
        minHeight:"100vh",
        padding:"40px",
        color:"white"
      }}
    >

      <h1>Planner 📅</h1>

      <div
        style={{
          background:"#1e293b",
          padding:"20px",
          borderRadius:"12px",
          marginTop:"20px"
        }}
      >

        <h3>Réunion projet</h3>

        <p>Lundi - 14h00</p>

      </div>

      <div
        style={{
          background:"#1e293b",
          padding:"20px",
          borderRadius:"12px",
          marginTop:"15px"
        }}
      >

        <h3>Présentation finale</h3>

        <p>Vendredi - 10h00</p>

      </div>

    </div>

  )

}

export default Planner