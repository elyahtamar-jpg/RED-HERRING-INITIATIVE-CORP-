import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Red Herring Initiative</h1>
      <p>Next.js Setup Successful</p>

      <div style={{ marginTop: 20 }}>
        <Link
          href="/complaint"
          style={{
            padding: "12px 20px",
            background: "darkred",
            color: "white",
            borderRadius: 6,
            textDecoration: "none",
            fontSize: 18,
            textDecoration: "none"
          }}
        >
          File a Complaint (Launch Helyah Assistant)
        </Link>
      </div>
    </div>
  );
}
