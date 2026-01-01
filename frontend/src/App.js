import { useState } from "react";

const API_BASE = "https://hr-onboarding-generator-2.onrender.com"; // 🔴 CHANGE if different

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState({
    company_policies: true,
    employee_benefits: true,
    team_introduction: true,
  });
  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setPreview("");

    const selectedElements = Object.keys(elements).filter(
      (key) => elements[key]
    );

    const res = await fetch(`${API_BASE}/api/documents/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName,
        role,
        selectedElements,
      }),
    });

    const data = await res.json();
    setPreview(data.content);
    setLoading(false);
  };

  const fetchHistory = async () => {
    const res = await fetch(
      `${API_BASE}/api/documents/history/${employeeName}`
    );
    const data = await res.json();
    setHistory(data);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>HR Onboarding Document Generator</h1>

      <input
        placeholder="Employee Name"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <br />
      <br />

      <h3>Select Onboarding Elements</h3>

      {Object.keys(elements).map((key) => (
        <label key={key} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={elements[key]}
            onChange={() =>
              setElements({ ...elements, [key]: !elements[key] })
            }
          />{" "}
          {key.replace("_", " ").toUpperCase()}
        </label>
      ))}

      <br />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Document"}
      </button>

      <hr />

      {preview && (
        <>
          <h2>Preview</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{preview}</pre>
        </>
      )}

      <hr />

      <h2>Document History</h2>
      <button onClick={fetchHistory}>Load History</button>

      {history.map((doc) => (
        <div key={doc._id} style={{ marginTop: 20 }}>
          <strong>{new Date(doc.createdAt).toLocaleString()}</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{doc.content}</pre>
        </div>
      ))}
    </div>
  );
}

export default App;
