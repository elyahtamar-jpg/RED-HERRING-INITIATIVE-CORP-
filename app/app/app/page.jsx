export default function Home() {
  return (
    <div>
      <h1>RED HERRING INITIATIVE CORP</h1>
      <h2>Civil Justice Advocacy • Florida</h2>

      <p>
        Exposing Injustice. Empowering Communities. Delivering Accountability.
      </p>

      <p>
        A statewide civil-justice advocacy corporation dedicated to protecting
        citizens’ rights, exposing misconduct, and demanding accountability
        across Florida.
      </p>

      <a
        href="/complaint"
        style={{
          display: "inline-block",
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          marginTop: "20px",
        }}
      >
        FILE A COMPLAINT
      </a>

      <h3 style={{ marginTop: "40px" }}>Our Five Divisions</h3>
      <ul>
        <li>Juvenile Justice Oversight</li>
        <li>Social Services & DCF</li>
        <li>Corrections & Detention</li>
        <li>Public Services & Agencies</li>
        <li>Governmental & Criminal Justice</li>
      </ul>

      <p style={{ marginTop: "40px", fontSize: "0.9rem", opacity: 0.7 }}>
        © 2025 Red Herring Initiative Corp. Registered Florida Civil Justice
        Advocacy Nonprofit Corporation. All Rights Reserved.
      </p>
    </div>
  );
}
