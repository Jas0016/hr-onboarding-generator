import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [elements, setElements] = useState({
    policies: true,
    benefits: true,
    team: true,
  });

  const [preview, setPreview] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateDocument = async () => {
    setLoading(true);
    setShowDownload(false);

    try {
      const res = await fetch(
        "https://hr-onboarding-generator-2.onrender.com/api/documents/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            role,
            elements: Object.keys(elements).filter((e) => elements[e]),
          }),
        }
      );

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      setPreview(data.content);
      setShowDownload(true);
    } catch (err) {
      alert("Generation failed");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>HR Onboarding Document Generator</h1>

      <input
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
          checked={elements.policies}
          onChange={() =>
            setElements({ ...elements, policies: !elements.policies })
          }
        />
        Company Policies
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={elements.benefits}
          onChange={() =>
            setElements({ ...elements, benefits: !elements.benefits })
          }
        />
        Employee Benefits
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={elements.team}
          onChange={() =>
            setElements({ ...elements, team: !elements.team })
          }
        />
        Team Introduction
      </label>

      <br />
      <br />

      <button onClick={generateDocument} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {preview && (
        <>
          <hr />
          <h2>Preview</h2>
          <pre>{preview}</pre>
        </>
      )}

      {showDownload && (
        <>
          <br />
          <button disabled>Download PDF (next step)</button>
        </>
      )}
    </div>
  );
}

export default App;
