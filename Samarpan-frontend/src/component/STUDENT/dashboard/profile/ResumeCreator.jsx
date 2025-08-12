import React, { useState } from "react";

const TABS = [
  "Personal Details",
  "Experience",
  "Education",
  "Certifications",
  "Projects",
  "Custom Details",
];

export default function ResumeCreator({ onBack }) {
  const [selectedTab, setSelectedTab] = useState("Personal Details");

  // Personal Details States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [summary, setSummary] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Skills as tags
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // Experience (multiple entries)
  const [experiences, setExperiences] = useState([
    { companyName: "", period: "", role: "", location: "", description: "" },
  ]);

  // Education (multiple entries)
  const [education, setEducation] = useState([
    { level: "Degree", degree: "", institute: "", year: "" },
  ]);

  // Certifications
  const [certifications, setCertifications] = useState([
    { name: "", institute: "", year: "" },
  ]);

  // Projects
  const [projects, setProjects] = useState([
    { title: "", description: "", projectLink: "", githubLink: "" },
  ]);

  // Custom Details
  const [customDetails, setCustomDetails] = useState([{ title: "", data: "" }]);

  // Common handlers for inputs
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setSkillInput("");
    }
  };
  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // States updates for array-based forms (experience, education, etc.)
  const updateEntry = (setter, data, index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setter(newData);
  };
  const addEntry = (setter, data, newItem) => {
    setter([...data, newItem]);
  };
  const removeEntry = (setter, data, index) => {
    if (data.length > 1) {
      setter(data.filter((_, i) => i !== index));
    }
  };

  // Handlers wrapped for clarity
  // Experience handlers
  const handleExperienceChange = (index, field, value) =>
    updateEntry(setExperiences, experiences, index, field, value);
  const addExperience = () =>
    addEntry(setExperiences, experiences, {
      companyName: "", period: "", role: "", location: "", description: "",
    });
  const removeExperience = (index) => removeEntry(setExperiences, experiences, index);

  // Education
  const handleEducationChange = (index, field, value) =>
    updateEntry(setEducation, education, index, field, value);
  const addEducation = () =>
    addEntry(setEducation, education, { level: "Degree", degree: "", institute: "", year: "" });
  const removeEducation = (index) => removeEntry(setEducation, education, index);

  // Certifications
  const handleCertificationChange = (index, field, value) =>
    updateEntry(setCertifications, certifications, index, field, value);
  const addCertification = () =>
    addEntry(setCertifications, certifications, { name: "", institute: "", year: "" });
  const removeCertification = (index) => removeEntry(setCertifications, certifications, index);

  // Projects
  const handleProjectChange = (index, field, value) =>
    updateEntry(setProjects, projects, index, field, value);
  const addProject = () =>
    addEntry(setProjects, projects, { title: "", description: "", projectLink: "", githubLink: "" });
  const removeProject = (index) => removeEntry(setProjects, projects, index);

  // Custom Details
  const handleCustomDetailChange = (index, field, value) =>
    updateEntry(setCustomDetails, customDetails, index, field, value);
  const addCustomDetail = () => addEntry(setCustomDetails, customDetails, { title: "", data: "" });
  const removeCustomDetail = (index) => removeEntry(setCustomDetails, customDetails, index);

  // Profile photo handler
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      fullName,
      email,
      phone,
      linkedin,
      github,
      leetcode,
      summary,
      skills,
      profilePhoto,
      experiences,
      education,
      certifications,
      projects,
      customDetails,
    };
    console.log("Resume data:", data);
    alert("Resume data logged to console!");
  };

  // Render content of selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "Personal Details":
        return (
          <div className="space-y-6">
            <Input id="fullName" label="Full Name" value={fullName} onChange={setFullName} required placeholder="Enter your full name" />
            <Input id="email" label="Email" type="email" value={email} onChange={setEmail} required placeholder="e.g. cagers@email.com" />
            <Input id="phone" label="Phone" type="tel" value={phone} onChange={setPhone} required placeholder="+91-XXX-XXXXXXX" />
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Profile Photo (optional)
              </label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} aria-label="Upload profile photo" className="mb-2" />
              {profilePhoto && <img src={profilePhoto} alt="Profile Preview" className="w-24 h-24 object-cover rounded-full border" />}
            </div>
            <Input id="linkedin" label="LinkedIn" type="url" value={linkedin} onChange={setLinkedin} placeholder="LinkedIn Profile URL" />
            <Input id="github" label="GitHub" type="url" value={github} onChange={setGithub} placeholder="GitHub Profile URL" />
            <Input id="leetcode" label="LeetCode" type="url" value={leetcode} onChange={setLeetcode} placeholder="LeetCode Profile URL" />
            <TextArea id="summary" label="Professional Summary" value={summary} onChange={setSummary} required placeholder="Write a brief summary about you..." rows={5} />
            <SkillsInput skills={skills} skillInput={skillInput} setSkillInput={setSkillInput} setSkills={setSkills} removeSkill={removeSkill} onKeyDown={handleSkillKeyDown} />
          </div>
        );

      case "Experience":
        return (
          <MultipleEntryInput
            data={experiences}
            fields={[
              { name: "companyName", label: "Company Name", type: "text", required: true },
              { name: "period", label: "Period", type: "text", required: true, placeholder: "e.g. 2020-2022" },
              { name: "role", label: "Role", type: "text", required: true },
              { name: "location", label: "Location", type: "text", required: true },
            ]}
            textareaField={{ name: "description", label: "Description", rows: 3, required: true, placeholder: "Describe your role and responsibilities" }}
            onChange={handleExperienceChange}
            onAdd={addExperience}
            onRemove={removeExperience}
          />
        );

      case "Education":
        return (
          <MultipleEntryInput
            data={education}
            fields={[
              { name: "level", label: "Level", type: "select", options: ["Matriculation", "Intermediate", "Graduation", "Diploma", "Post Graduation"], required: true },
              { name: "degree", label: "Degree/Course", type: "text", required: true },
              { name: "institute", label: "Institute Name", type: "text", required: true },
              { name: "year", label: "Year of Graduation", type: "text", required: true },
            ]}
            onChange={handleEducationChange}
            onAdd={addEducation}
            onRemove={removeEducation}
          />
        );

      case "Certifications":
        return (
          <MultipleEntryInput
            data={certifications}
            fields={[
              { name: "name", label: "Certification Name", type: "text", required: true },
              { name: "institute", label: "Institute", type: "text", required: true },
              { name: "year", label: "Year", type: "text", required: true },
            ]}
            onChange={handleCertificationChange}
            onAdd={addCertification}
            onRemove={removeCertification}
          />
        );

      case "Projects":
        return (
          <MultipleEntryInput
            data={projects}
            fields={[{ name: "title", label: "Project Title", type: "text", required: true }]}
            textareaField={{ name: "description", label: "Description", rows: 3, required: true, placeholder: "Describe your project" }}
            extraFields={[
              { name: "projectLink", label: "Project Link (optional)", type: "url" },
              { name: "githubLink", label: "GitHub Link (optional)", type: "url" },
            ]}
            onChange={handleProjectChange}
            onAdd={addProject}
            onRemove={removeProject}
          />
        );

      case "Custom Details":
        return (
          <MultipleEntryInput
            data={customDetails}
            fields={[
              { name: "title", label: "Title", type: "text", required: true },
              { name: "data", label: "Data", type: "text", required: true },
            ]}
            onChange={handleCustomDetailChange}
            onAdd={addCustomDetail}
            onRemove={removeCustomDetail}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-10 mt-10 flex flex-col lg:flex-row max-w-7xl mx-auto gap-10">
      {/* Left panel: content of selected tab */}
      <div className="lg:flex-1 bg-white rounded-2xl shadow-xl p-8 overflow-auto max-h-[calc(100vh-4rem)]">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {renderContent()}
          <div className="block lg:hidden">
            {/* On mobile: Show submit also here */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition text-lg font-semibold mt-6"
            >
              Generate Resume
            </button>
          </div>
        </form>
      </div>

      {/* Right panel: tab list */}
      <nav
        aria-label="Resume Sections"
        className="lg:w-60 bg-white rounded-2xl shadow-xl flex lg:flex-col overflow-x-auto no-scrollbar"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`cursor-pointer flex-shrink-0 px-6 py-4 w-full text-left text-sm font-semibold border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              selectedTab === tab
                ? "bg-blue-600 text-white"
                : "text-gray-700 bg-white"
            }`}
          >
            {tab}
          </button>
        ))}

        {/* On large screens, show submit button below tabs */}
        <div className="hidden lg:block px-6 py-4 border-t border-gray-200">
          <button
            type="submit"
            onClick={handleSubmit}
            className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-700 transition text-lg font-semibold"
          >
            Generate Resume
          </button>
        </div>
      </nav>
    </div>
  );
}

// Generic Input Component
function Input({ id, label, type = "text", value, onChange, placeholder = "", required = false }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// Generic TextArea Component
function TextArea({ id, label, value, onChange, rows = 3, placeholder = "", required = false }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// Skills Input Component
function SkillsInput({ skills, skillInput, setSkillInput, setSkills, removeSkill, onKeyDown }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
      <div
        className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[44px] focus-within:ring-2 focus-within:ring-blue-500 cursor-text"
        onClick={() => document.getElementById("skillInput").focus()}
        aria-label="Skills input"
      >
        {skills.map((skill, i) => (
          <div
            key={i}
            className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm select-none"
          >
            {skill}
            <button
              type="button"
              aria-label={`Remove skill ${skill}`}
              onClick={() => removeSkill(skill)}
              className="ml-2 rounded-full hover:bg-blue-300 focus:bg-blue-300 focus:outline-none"
              tabIndex={0}
            >
              ×
            </button>
          </div>
        ))}
        <input
          id="skillInput"
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type skill and press Enter or comma"
          className="flex-grow min-w-[120px] border-none outline-none px-2 py-1 text-sm"
          aria-describedby="skillsDescription"
        />
      </div>
      <p id="skillsDescription" className="text-xs text-gray-500 mt-1">
        Press Enter or comma to add skill, click × to remove.
      </p>
    </div>
  );
}

// Multiple Entry Input Component (for Experience, Education, etc.)
function MultipleEntryInput({ data, fields, textareaField, extraFields = [], onChange, onAdd, onRemove }) {
  return (
    <div className="space-y-6">
      {data.map((item, i) => (
        <div key={i} className="border rounded-lg p-4 relative bg-white shadow-sm">
          <button
            type="button"
            onClick={() => onRemove(i)}
            disabled={data.length <= 1}
            aria-label={`Remove entry ${i + 1}`}
            className={`absolute top-3 right-3 text-2xl font-bold rounded focus:outline-none focus:ring-2 focus:ring-red-500 ${
              data.length <= 1 ? "text-gray-300 cursor-not-allowed" : "text-red-600 hover:text-red-800"
            }`}
            title="Remove entry"
            style={{ lineHeight: 1 }}
          >
            &minus;
          </button>

          <div className={`grid grid-cols-1 sm:grid-cols-${fields.length + extraFields.length} gap-4 mb-4`}>
            {fields.map(({ name, label, type = "text", required = false, placeholder = "", options = [] }) =>
              type === "select" ? (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <select
                    value={item[name]}
                    onChange={(e) => onChange(i, name, e.target.value)}
                    required={required}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={item[name]}
                    onChange={(e) => onChange(i, name, e.target.value)}
                    required={required}
                    placeholder={placeholder || label}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )
            )}

            {/* Extra optional fields */}
            {extraFields.map(({ name, label, type = "text", placeholder = "" }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  value={item[name] || ""}
                  onChange={(e) => onChange(i, name, e.target.value)}
                  placeholder={placeholder || label}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Textarea */}
          {textareaField && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{textareaField.label}</label>
              <textarea
                value={item[textareaField.name] || ""}
                onChange={(e) => onChange(i, textareaField.name, e.target.value)}
                rows={textareaField.rows}
                placeholder={textareaField.placeholder || textareaField.label}
                required={textareaField.required || false}
                className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={onAdd} className="cursor-pointer text-blue-600 font-semibold hover:underline">
        + Add
      </button>
    </div>
  );
}
