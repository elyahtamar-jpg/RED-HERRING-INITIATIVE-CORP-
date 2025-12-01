export default function ComplaintPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>File a Complaint</h1>

      <form method="POST" action="/api/complaint" style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
        <label>Your Full Name</label>
        <input type="text" name="name" required />

        <label>Do you have evidence? (documents, screenshots, etc.)</label>
        <input type="text" name="evidence" />

        <button type="submit" style={{ padding: 10, background: "black", color: "white" }}>
          Submit Complaint
        </button>
      </form>
    </div>
  );
}
