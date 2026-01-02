import React, { useState } from "react";

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");

  const [companyPolicies, setCompanyPolicies] = useState(true);
  const [employeeBenefits, setEmployeeBenefits] = useState(true);
  const [teamIntroduction, setTeamIntroduction] = useState(true);

  const [loading, setLoading] = useState(false);

  const generateDocument = async () => {
    try {
      setLoading(true);

      const elements = [];
      if (companyPolicies) elements.push("company_policies");
      if (employeeBenefits) elements.push("employee_benefits");
      if (teamIntroduction) elements.push("team_introduction");

      console.log("Sending payload:", {
        employeeName,
        role,
        elements,
      });

      const response = await fetch(
        "https://hr-onboarding-generator-2.onrender.com/api/documents/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeName,
            role,
            elements,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend error:", text);
        throw new Error("Generation failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `onboarding-${employeeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Generation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>HR Onboarding Document Generator</h1>

      <input
        placeholder="Employee Name"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <br /><br />

      <h3>Select Onboarding Elements</h3>

      <label>
        <input
          type="checkbox"
          checked={companyPolicies}
          onChange={() => setCompanyPolicies(!companyPolicies)}
        />
        Company Policies
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={employeeBenefits}
          onChange={() => setEmployeeBenefits(!employeeBenefits)}
        />
        Employee Benefits
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={teamIntroduction}
          onChange={() => setTeamIntroduction(!teamIntroduction)}
        />
        Team Introduction
      </label>
      <br /><br />

      <button onClick={generateDocument} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}

export default App;
