export default function HomePage() {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
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
          marginTop: "20px",
          padding: "12px 20px",
          background: "black",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
        }}
      >
        FILE A COMPLAINT
      </a>
    </div>
  );
}
