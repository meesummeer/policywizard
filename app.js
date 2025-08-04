const formFields = [
    {
        id: "org_type",
        label: "Organization Type",
        options: [
            { value: "clinic", label: "Clinic/Practice" },
            { value: "hospital", label: "Hospital" },
            { value: "telehealth", label: "Telehealth Provider" },
            { value: "dental", label: "Dental Office" }
        ]
    },
    {
        id: "staff_count",
        label: "Number of Employees/Providers",
        options: [
            { value: "1-5", label: "1-5" },
            { value: "6-25", label: "6-25" },
            { value: "26-100", label: "26-100" },
            { value: "100+", label: "100+" }
        ]
    },
    {
        id: "ehr_system",
        label: "Main EHR System",
        options: [
            { value: "epic", label: "Epic" },
            { value: "cerner", label: "Cerner" },
            { value: "athena", label: "Athenahealth" },
            { value: "paper", label: "Paper/Manual" },
            { value: "other", label: "Other" }
        ]
    },
    {
        id: "security_officer",
        label: "Designated Security Officer Name",
        type: "text",
        placeholder: "e.g. Dr. Fatima Siddiqui"
    }
];

let formState = {};

function renderForm() {
    let html = "";
    formFields.forEach(field => {
        html += `<label for="${field.id}">${field.label}</label>`;
        if (field.type === "text") {
            html += `<input type="text" id="${field.id}" placeholder="${field.placeholder || ""}"><br>`;
        } else {
            html += `<select id="${field.id}">`;
            field.options.forEach(opt => {
                html += `<option value="${opt.value}">${opt.label}</option>`;
            });
            html += `</select><br>`;
        }
    });
    html += `<button id="generate-btn">Generate Policy</button>`;
    document.getElementById("wizard-container").innerHTML = html;
    document.getElementById("wizard-container").classList.remove("hidden");
    document.getElementById("policy-section").classList.add("hidden");

    document.getElementById("generate-btn").onclick = function() {
        formFields.forEach(f => {
            if (f.type === "text") {
                formState[f.id] = document.getElementById(f.id).value || "[Security Officer Name]";
            } else {
                formState[f.id] = document.getElementById(f.id).value;
            }
        });
        renderPolicy();
    };
}

function renderPolicy() {
    // Customizable boilerplate HIPAA policy
    const ehrLabel = {
        epic: "Epic EHR",
        cerner: "Cerner EHR",
        athena: "Athenahealth EHR",
        paper: "Manual (Paper) Records",
        other: "Other (Specified by Practice)"
    }[formState.ehr_system] || formState.ehr_system;

    const orgTypes = {
        clinic: "Clinic/Practice",
        hospital: "Hospital",
        telehealth: "Telehealth Provider",
        dental: "Dental Office"
    };

    const year = new Date().getFullYear();

    const policyText = `HIPAA Security Policy
Organization: ${orgTypes[formState.org_type]}
Primary EHR System: ${ehrLabel}
Number of Employees: ${formState.staff_count}
Security Officer: ${formState.security_officer}

---

**Purpose:**  
This policy establishes administrative, physical, and technical safeguards for protecting Protected Health Information (PHI) as required by the HIPAA Security Rule.

**Scope:**  
All staff, providers, and contractors of this organization must comply.

**Key Policies:**

1. **Designation:**  
   ${formState.security_officer} is the Security Officer, responsible for overseeing HIPAA compliance and incident response.

2. **Access Controls:**  
   Access to PHI is restricted to authorized personnel using unique logins/passwords. User access is reviewed quarterly and promptly revoked upon termination.

3. **Data Storage:**  
   All PHI is stored in ${ehrLabel}. Physical charts (if any) are locked and accessible only to authorized staff.

4. **Transmission:**  
   PHI may only be sent using encrypted email or secure EHR messaging. Faxed or printed records are sent only when strictly necessary.

5. **Incident Response:**  
   Any suspected breach must be reported immediately to the Security Officer. Incidents will be investigated and, if required, reported to affected patients and authorities within HIPAA timelines.

6. **Training:**  
   All employees receive HIPAA/privacy training at hire and annually.

7. **Physical Security:**  
   Offices and server rooms are secured by key, badge, or access code. Visitors are escorted.

8. **Disposal:**  
   PHI in paper or electronic form is destroyed securely (shredding or digital wiping) prior to disposal.

**Approval and Review:**  
This policy will be reviewed annually and updated as needed.

Signed: ___________________      Date: _______________
(CyberHealth Solutions · ${year})

---

*This policy was auto-generated with PolicyWizard for portfolio/demo use only.*
`;

    document.getElementById("policy-output").value = policyText;
    document.getElementById("policy-section").classList.remove("hidden");
    document.getElementById("wizard-container").classList.add("hidden");
}

document.getElementById("copy-btn").onclick = function () {
    const ta = document.getElementById("policy-output");
    ta.select();
    document.execCommand("copy");
    alert("Policy copied to clipboard!");
};

document.getElementById("download-btn").onclick = function () {
    const text = document.getElementById("policy-output").value;
    const blob = new Blob([text], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HIPAA_Policy.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

window.onload = function () {
    renderForm();
};
