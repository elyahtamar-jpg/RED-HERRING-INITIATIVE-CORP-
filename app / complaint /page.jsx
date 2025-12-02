export default function ComplaintPage() {
  async function submitForm(event) {
    event.preventDefault();

    const formData = {
      name: event.target.name.value,
      evidence: event.target.evidence.value
    };

    const res = await fetch("/api/complaint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    alert(data.message || "Complaint submitted");
  }

  return (
    <div style={{ padding: "40px", fontFamily: "system-ui" }}>
      <h1>File a Complaint</h1>

      <form onSubmit={submitForm}>
        <label>Your Name:</label>
        <input
          type="text"
          name="name"
          required
          style={{ display: "block", marginBottom: "20px", width: "300px" }}
        />

        <label>Do you have evidence?</label>
        <input
          type="text"
          name="evidence"
          required
          style={{ display: "block", marginBottom: "20px", width: "300px" }}
        />

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
}
