import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState([]);

  const toggle = key =>
    setElements(prev =>
      prev.includes(key) ? prev.filter(e => e !== key) : [...prev, key]
    );

  const generate = async () => {
    const res = await fetch(
      "https://hr-onboarding-generator-2.onrender.com/api/documents/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName: name,
          role,
          selectedElements: elements
        })
      }
    );

    if (!res.ok) {
      alert("Generation failed");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}_Onboarding.pdf`;
    a.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>HR Onboarding Document Generator</h1>

      <input placeholder="Employee Name" onChange={e => setName(e.target.value)} />
      <br /><br />
      <input placeholder="Role" onChange={e => setRole(e.target.value)} />

      <h3>Select Onboarding Elements</h3>
      <label><input type="checkbox" onChange={() => toggle("company_policies")} /> Company Policies</label><br/>
      <label><input type="checkbox" onChange={() => toggle("employee_benefits")} /> Employee Benefits</label><br/>
      <label><input type="checkbox" onChange={() => toggle("team_intro")} /> Team Introduction</label><br/><br/>

      <button onClick={generate}>Generate & Download PDF</button>
    </div>
  );
}

export default App;
