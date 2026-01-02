import { useEffect, useState } from "react";

const API = "https://hr-onboarding-generator-2.onrender.com/api/documents";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState({
    company_policies: true,
    employee_benefits: true,
    team_introduction: true
  });
  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);

  const selectedKeys = Object.keys(elements).filter(k => elements[k]);

  const generatePreview = async () => {
    const res = await fetch(`${API}/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName: name,
        role,
        elements: selectedKeys
      })
    });

    const data = await res.json();
    setPreview(data.content);
  };

  const downloadPDF = async () => {
    const res = await fetch(`${API}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName: name,
        role,
        elements: selectedKeys,
        content: preview
      })
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onboarding.pdf";
    a.click();
  };

  const loadHistory = async () => {
    const res = await fetch(`${API}/history`);
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>HR Onboarding Document Generator</h1>

      <input placeholder="Employee Name" value={name} onChange={e => setName(e.target.value)} /><br /><br />
      <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} /><br /><br />

      <h3>Select Onboarding Elements</h3>
      {Object.keys(elements).map(k => (
        <div key={k}>
          <input
            type="checkbox"
            checked={elements[k]}
            onChange={() => setElements({ ...elements, [k]: !elements[k] })}
          />
          {k.replace("_", " ").toUpperCase()}
        </div>
      ))}

      <br />
      <button onClick={generatePreview}>Generate Preview</button>

      {preview && (
        <>
          <hr />
          <h3>Preview</h3>
          <pre>{preview}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}

      <hr />
      <h3>Document History</h3>
      {history.map((h, i) => (
        <div key={i}>
          <b>{h.employeeName}</b> – {h.role} – {new Date(h.createdAt).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export default App;
