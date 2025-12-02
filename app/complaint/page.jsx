"use client";

import { useState } from "react";

export default function ComplaintPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredContact: "phone",
    incidentDate: "",
    incidentLocation: "",
    agencyType: "",
    agencyName: "",
    officerNames: "",
    badgeOrId: "",
    caseOrReportNumber: "",
    whatHappened: "",
    rightsType: "",
    evidenceAvailable: "yes",
    evidenceDetails: "",
    witnesses: "",
    immediateDanger: "no",
    consentToContact: true,
    consentToStore: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function generateComplaintNumber() {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.floor(1000 + Math.random() * 9000); // 4-digit code
    return `RHI-${datePart}-${rand}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(null);

    // Simple required checks
    if (!form.fullName || !form.whatHappened || !form.incidentLocation) {
      setError("Please fill in your name, what happened, and where it happened.");
      return;
    }

    if (!form.consentToStore) {
      setError("We cannot process your complaint unless you consent to data storage.");
      return;
    }

    setSubmitting(true);

    const complaintNumber = generateComplaintNumber();

    try {
      const res = await fetch("/api/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintNumber,
          ...form,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit complaint");
      }

      setSuccess({
        complaintNumber,
      });

      // Reset most fields, but keep contact info so they don’t have to retype
      setForm((prev) => ({
        ...prev,
        incidentDate: "",
        incidentLocation: "",
        agencyType: "",
        agencyName: "",
        officerNames: "",
        badgeOrId: "",
        caseOrReportNumber: "",
        whatHappened: "",
        rightsType: "",
        evidenceAvailable: "yes",
        evidenceDetails: "",
        witnesses: "",
        immediateDanger: "no",
      }));
    } catch (err) {
      console.error(err);
      setError("There was a problem submitting your complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const containerStyle = {
    maxWidth: 800,
    margin: "0 auto",
    padding: "24px 16px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    lineHeight: 1.5,
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    border: "1px solid #eee",
  };

  const labelStyle = {
    display: "block",
    fontWeight: 600,
    marginBottom: 4,
    fontSize: 14,
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
    marginBottom: 12,
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: 120,
    resize: "vertical",
  };

  const sectionTitleStyle = {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 8,
  };

  const disclaimerStyle = {
    fontSize: 12,
    color: "#555",
    marginTop: 16,
    borderTop: "1px solid #eee",
    paddingTop: 12,
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>
        Red Herring Initiative – Civil Rights Complaint
      </h1>
      <p style={{ marginBottom: 16, fontSize: 14 }}>
        Use this form to report possible violations of your civil rights under{" "}
        <strong>18 U.S.C. § 242</strong> or related laws. Answer as much as you can.
      </p>

      <div style={cardStyle}>
        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#900",
              padding: "8px 10px",
              borderRadius: 8,
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#e6ffed",
              color: "#075e18",
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            <strong>Thank you. Your complaint has been submitted.</strong>
            <br />
            Your Complaint File Number is:{" "}
            <strong>{success.complaintNumber}</strong>
            <br />
            Please write this number down or screenshot this page. It will be used
            to track follow-up.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h2 style={sectionTitleStyle}>1. Your Information</h2>

          <label style={labelStyle} htmlFor="fullName">
            Full Name (required)
          </label>
          <input
            id="fullName"
            name="fullName"
            style={inputStyle}
            value={form.fullName}
            onChange={handleChange}
            placeholder="First and last name"
            required
          />

          <label style={labelStyle} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            style={inputStyle}
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <label style={labelStyle} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            style={inputStyle}
            value={form.phone}
            onChange={handleChange}
            placeholder="(###) ###-####"
          />

          <label style={labelStyle} htmlFor="preferredContact">
            How should we contact you?
          </label>
          <select
            id="preferredContact"
            name="preferredContact"
            style={inputStyle}
            value={form.preferredContact}
            onChange={handleChange}
          >
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="either">Either phone or email</option>
          </select>

          <h2 style={sectionTitleStyle}>2. What Happened</h2>

          <label style={labelStyle} htmlFor="incidentDate">
            Date of incident (approximate is okay)
          </label>
          <input
            id="incidentDate"
            name="incidentDate"
            type="date"
            style={inputStyle}
            value={form.incidentDate}
            onChange={handleChange}
          />

          <label style={labelStyle} htmlFor="incidentLocation">
            Where did this happen? (required)
          </label>
          <input
            id="incidentLocation"
            name="incidentLocation"
            style={inputStyle}
            value={form.incidentLocation}
            onChange={handleChange}
            placeholder="City, county, facility name, etc."
            required
          />

          <label style={labelStyle} htmlFor="agencyType">
            Type of agency involved
          </label>
          <select
            id="agencyType"
            name="agencyType"
            style={inputStyle}
            value={form.agencyType}
            onChange={handleChange}
          >
            <option value="">Select one</option>
            <option value="police">Police Department</option>
            <option value="sheriff">Sheriff / County Jail</option>
            <option value="prison">State Prison / FDOC</option>
            <option value="juvenile">Juvenile Justice / Detention</option>
            <option value="dcf">DCF / Child Welfare</option>
            <option value="court">Court / State Attorney</option>
            <option value="other">Other government agency</option>
          </select>

          <label style={labelStyle} htmlFor="agencyName">
            Agency / Facility Name
          </label>
          <input
            id="agencyName"
            name="agencyName"
            style={inputStyle}
            value={form.agencyName}
            onChange={handleChange}
            placeholder="Example: Hillsborough County Sheriff’s Office"
          />

          <label style={labelStyle} htmlFor="officerNames">
            Names of officers / staff involved (if known)
          </label>
          <input
            id="officerNames"
            name="officerNames"
            style={inputStyle}
            value={form.officerNames}
            onChange={handleChange}
            placeholder="List names, titles, or descriptions"
          />

          <label style={labelStyle} htmlFor="badgeOrId">
            Badge or ID numbers (if known)
          </label>
          <input
            id="badgeOrId"
            name="badgeOrId"
            style={inputStyle}
            value={form.badgeOrId}
            onChange={handleChange}
          />

          <label style={labelStyle} htmlFor="caseOrReportNumber">
            Case / report / docket number (if any)
          </label>
          <input
            id="caseOrReportNumber"
            name="caseOrReportNumber"
            style={inputStyle}
            value={form.caseOrReportNumber}
            onChange={handleChange}
          />

          <label style={labelStyle} htmlFor="rightsType">
            What best describes the violation?
          </label>
          <select
            id="rightsType"
            name="rightsType"
            style={inputStyle}
            value={form.rightsType}
            onChange={handleChange}
          >
            <option value="">Choose one (if possible)</option>
            <option value="excessive_force">Excessive force / brutality</option>
            <option value="wrongful_arrest">
              Wrongful arrest / unlawful detention
            </option>
            <option value="medical_neglect">
              Denial of medical care / serious neglect
            </option>
            <option value="retaliation">
              Retaliation for filing a grievance or speaking up
            </option>
            <option value="child_welfare">
              Unlawful removal or threat to remove a child
            </option>
            <option value="discrimination">
              Discrimination (race, disability, religion, etc.)
            </option>
            <option value="other">Other civil rights violation</option>
          </select>

          <label style={labelStyle} htmlFor="whatHappened">
            Describe what happened (required)
          </label>
          <textarea
            id="whatHappened"
            name="whatHappened"
            style={textareaStyle}
            value={form.whatHappened}
            onChange={handleChange}
            placeholder="Tell us what happened in your own words. Include who, what, when, where, and how your rights were violated."
            required
          />

          <h2 style={sectionTitleStyle}>3. Evidence & Witnesses</h2>

          <label style={labelStyle} htmlFor="evidenceAvailable">
            Do you have any evidence?
          </label>
          <select
            id="evidenceAvailable"
            name="evidenceAvailable"
            style={inputStyle}
            value={form.evidenceAvailable}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="not_sure">Not sure</option>
          </select>

          <label style={labelStyle} htmlFor="evidenceDetails">
            If yes, describe the evidence you have
          </label>
          <textarea
            id="evidenceDetails"
            name="evidenceDetails"
            style={textareaStyle}
            value={form.evidenceDetails}
            onChange={handleChange}
            placeholder="Example: incident reports, medical records, videos, photos, bodycam, court documents, etc."
          />

          <label style={labelStyle} htmlFor="witnesses">
            Witnesses (names and contact, if known)
          </label>
          <textarea
            id="witnesses"
            name="witnesses"
            style={textareaStyle}
            value={form.witnesses}
            onChange={handleChange}
            placeholder="List anyone who saw or heard what happened."
          />

          <h2 style={sectionTitleStyle}>4. Safety & Consent</h2>

          <label style={labelStyle} htmlFor="immediateDanger">
            Are you or someone else in immediate danger right now?
          </label>
          <select
            id="immediateDanger"
            name="immediateDanger"
            style={inputStyle}
            value={form.immediateDanger}
            onChange={handleChange}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          <div style={{ marginBottom: 10, fontSize: 13 }}>
            <label>
              <input
                type="checkbox"
                name="consentToContact"
                checked={form.consentToContact}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              I agree that Red Herring Initiative Corp. may contact me using the
              phone or email I provided.
            </label>
          </div>

          <div style={{ marginBottom: 10, fontSize: 13 }}>
            <label>
              <input
                type="checkbox"
                name="consentToStore"
                checked={form.consentToStore}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              I understand that the information I submit will be stored securely
              and used for advocacy, documentation, and follow-up.
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 8,
              padding: "10px 18px",
              borderRadius: 999,
              border: "none",
              fontSize: 15,
              fontWeight: 600,
              cursor: submitting ? "wait" : "pointer",
              background: "#111827",
              color: "#fff",
              width: "100%",
            }}
          >
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>

        <div style={disclaimerStyle}>
          <strong>Disclaimer – Please Read:</strong>
          <br />
          Red Herring Initiative Corp. is a{" "}
          <strong>Civil Justice Advocacy Corporation</strong>. We are{" "}
          <strong>not a law firm</strong> and do{" "}
          <strong>not provide legal representation</strong>, legal advice, or an
          attorney-client relationship. The information you share is used to
          document possible civil rights violations, to assist with reporting,
          and to support systemic advocacy and accountability efforts.
          <br />
          <br />
          Submitting this form does <strong>not</strong> guarantee an
          investigation, lawsuit, or any particular outcome. In an emergency or
          if someone is in immediate danger, call <strong>911</strong> or your
          local emergency number first.
        </div>
      </div>
    </div>
  );
}
