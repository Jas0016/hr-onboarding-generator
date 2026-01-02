import { useState } from "react";

const API = "https://hr-onboarding-generator-2.onrender.com/api/documents";

export default function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [elements] = useState([
    "company_policies",
    "employee_benefits",
    "team_introduction"
  ]);
  const [preview, setPreview] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const generatePreview = async () => {
    const res = await fetch(`${API}/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeName, role, elements })
    });
    const data = await res.json();
    setPreview(data.content);
  };

  const downloadPDF = async () => {
    const res = await fetch(`${API}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeName, role, elements, content: preview })
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onboarding.pdf";
    a.click();
  };

  const toggleHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    const res = await fetch(`${API}/history`);
    setHistory(await res.json());
    setShowHistory(true);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>HR Onboarding Document Generator</h1>

      <input placeholder="Employee Name" onChange={e => setEmployeeName(e.target.value)} />
      <br /><br />
      <input placeholder="Role" onChange={e => setRole(e.target.value)} />
      <br /><br />

      <button onClick={generatePreview}>Generate Preview</button>

      {preview && (
        <>
          <pre>{preview}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}

      <hr />
      <button onClick={toggleHistory}>History</button>

      {showHistory && history.map(h => (
        <div key={h._id}>
          {h.employeeName} – {h.role}
        </div>
      ))}
    </div>
  );
}
