import { useState } from "react";

const API = "https://hr-onboarding-generator-2.onrender.com/api/documents";

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (key) => {
    setElements((prev) =>
      prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]
    );
  };

  const generatePDF = async () => {
    setLoading(true);
    const res = await fetch(`${API}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName,
        role,
        elements,
      }),
    });

    if (!res.ok) {
      alert("PDF generation failed");
      setLoading(false);
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${employeeName}_Onboarding.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
    setLoading(false);
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

      <label>
        <input
          type="checkbox"
          onChange={() => toggle("company_policies")}
        />{" "}
        Company Policies
      </label>
      <br />

      <label>
        <input type="checkbox" onChange={() => toggle("benefits")} /> Employee
        Benefits
      </label>
      <br />

      <label>
        <input type="checkbox" onChange={() => toggle("team_intro")} /> Team
        Introduction
      </label>
      <br />
      <br />

      <button onClick={generatePDF} disabled={loading}>
        {loading ? "Generating..." : "Generate & Download PDF"}
      </button>
    </div>
  );
}

export default App;
