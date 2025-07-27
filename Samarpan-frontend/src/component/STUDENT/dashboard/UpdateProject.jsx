import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { CloudUpload, Check } from "lucide-react";

const fallbackImage = "https://via.placeholder.com/600x400?text=No+Image+Available";

const skillOptions = [
  { value: "HTML", label: "HTML" }, { value: "CSS", label: "CSS" }, { value: "SASS", label: "SASS" },
  { value: "Tailwind CSS", label: "Tailwind CSS" }, { value: "Bootstrap", label: "Bootstrap" },
  { value: "JavaScript", label: "JavaScript" }, { value: "TypeScript", label: "TypeScript" },
  { value: "React", label: "React" }, { value: "Next.js", label: "Next.js" }, { value: "Vue.js", label: "Vue.js" },
  { value: "Angular", label: "Angular" }, { value: "Node.js", label: "Node.js" }, { value: "Express", label: "Express" },
  { value: "Java", label: "Java" }, { value: "Spring Boot", label: "Spring Boot" }, { value: "Python", label: "Python" },
  { value: "Django", label: "Django" }, { value: "Flask", label: "Flask" }, { value: "PHP", label: "PHP" },
  { value: "Laravel", label: "Laravel" }, { value: "Go", label: "Go" }, { value: "Ruby on Rails", label: "Ruby on Rails" },
  { value: "Flutter", label: "Flutter" }, { value: "Dart", label: "Dart" }, { value: "React Native", label: "React Native" },
  { value: "Kotlin", label: "Kotlin" }, { value: "Swift", label: "Swift" }, { value: "MongoDB", label: "MongoDB" },
  { value: "MySQL", label: "MySQL" }, { value: "PostgreSQL", label: "PostgreSQL" }, { value: "SQLite", label: "SQLite" },
  { value: "Redis", label: "Redis" }, { value: "Firebase", label: "Firebase" }, { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" }, { value: "AWS", label: "AWS" }, { value: "Azure", label: "Azure" },
  { value: "GCP", label: "GCP" }, { value: "Git", label: "Git" }, { value: "GitHub Actions", label: "GitHub Actions" },
  { value: "CI/CD", label: "CI/CD" }, { value: "Nginx", label: "Nginx" }, { value: "Netlify", label: "Netlify" },
  { value: "Cloudinary", label: "Cloudinary" }, { value: "Render", label: "Render" }, { value: "GraphQL", label: "GraphQL" },
  { value: "REST API", label: "REST API" }, { value: "Swagger", label: "Swagger" }, { value: "gRPC", label: "gRPC" },
  { value: "WebSockets", label: "WebSockets" }, { value: "Jest", label: "Jest" }, { value: "Mocha", label: "Mocha" },
  { value: "Cypress", label: "Cypress" }, { value: "Figma", label: "Figma" }, { value: "Postman", label: "Postman" },
  { value: "VS Code", label: "VS Code" }, { value: "Linux", label: "Linux" }
];

export default function UpdateProject() {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;

  const [formData, setFormData] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(fallbackImage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descLimit, setDescLimit] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUserData(parsedUser);

    if (project) {
      setFormData({
        studentName: parsedUser.name || project.studentName || "John Doe",
        projectName: project.projectName || "",
        deployedLink: project.deployedLink || "",
        githubLink: project.githubLink || "",
        description: project.description || "",
        subject: project.subject || "",
        thumbnail: null,
        technologiesUsed: Array.isArray(project.technologiesUsed)
          ? project.technologiesUsed
          : typeof project.technologiesUsed === "string"
            ? project.technologiesUsed.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        projectId: project.projectId || "",
      });
      setThumbnailPreview(project.imageUrls || fallbackImage);
      setDescLimit(project.description?.length || 0);
    } else {
      setError("No project data available to update.");
    }

    fetch("https://samarpan2-o.onrender.com/api/subject/getAllSubjects")
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Error fetching subjects:", err));
  }, [project, navigate]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">Loading project details...</div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      if (value.length <= 300) {
        setFormData({ ...formData, description: value });
        setDescLimit(value.length);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = [
      "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    ];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type! Please upload an image (jpg, jpeg, png, gif, webp).");
      return;
    }
    setError(null);
    setFormData({ ...formData, thumbnail: file });
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleTechChange = (selected) => {
    setFormData({
      ...formData,
      technologiesUsed: selected ? selected.map((s) => s.value) : [],
    });
  };

  const getSubjectIdByName = (subjectName) => {
    const subject = subjects.find((subj) => subj.subjectName === subjectName);
    return subject ? subject.id : null;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem("token");
    const batchId = userData?.batch?.id;

    if (!token) return navigate("/");
    if (!formData.subject) return setError("Please select a subject.");
    if (!formData.technologiesUsed.length) return setError("Enter at least one technology used.");
    if (!batchId) return setError("Batch information is missing.");
    if (!formData.projectId) return setError("Project ID is missing.");

    try {
      let thumbnailUrl = project?.imageUrls;

      if (formData.thumbnail) {
        const imageData = new FormData();
        imageData.append("file", formData.thumbnail);
        imageData.append("upload_preset", "samarpan_unsigned");
        imageData.append("folder", "Samarpan-projects-preview");

        const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dickevacs/image/upload", {
          method: "POST",
          body: imageData,
        });

        const cloudinaryData = await cloudinaryRes.json();

        if (!cloudinaryRes.ok) {
          setIsSubmitting(false);
          return setError("Image upload failed: " + cloudinaryData.error?.message);
        }
        thumbnailUrl = cloudinaryData.secure_url;
      }

      const subjectId = getSubjectIdByName(formData.subject);

      const completeProjectData = {
        projectId: formData.projectId,
        studentId: userData?.id || "",
        projectName: formData.projectName,
        githubLink: formData.githubLink,
        deployedLink: formData.deployedLink,
        imageUrls: thumbnailUrl,
        technologiesUsed: formData.technologiesUsed,
        description: formData.description,
        subject: formData.subject,
        subjectId: subjectId,
      };

      const response = await fetch("https://samarpan2-o.onrender.com/api/projects/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(completeProjectData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          setIsSubmitting(false);
          return navigate("/");
        } else {
          setIsSubmitting(false);
          return setError("Failed to update project: " + (result.message || "Unknown error"));
        }
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/view-project", { state: { project: { ...project, ...completeProjectData, imageUrls: thumbnailUrl } } });
      }, 1500);
    } catch (err) {
      setError("Something went wrong: " + err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="pt-[10vh] items-center justify-center min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 px-2">
      <main className="w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg pb-8">
        <h2 className="text-lg md:text-2xl font-semibold text-gray-800 px-3 mb-6">
          Update Project
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            Project updated successfully!
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-base"
                placeholder="Enter project name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-base"
                required
                disabled={isSubmitting}
              >
                <option value="" disabled>Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.subjectName}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Deployed Link
              </label>
              <input
                type="url"
                name="deployedLink"
                value={formData.deployedLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-base"
                placeholder="https://"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">
                GitHub Link
              </label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 text-base"
                placeholder="https://github.com/"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Technologies Used
            </label>
            <Select
              isMulti
              name="technologiesUsed"
              options={skillOptions}
              className="text-sm"
              classNamePrefix="react-select"
              value={skillOptions.filter((opt) =>
                formData.technologiesUsed.includes(opt.value)
              )}
              onChange={handleTechChange}
              isDisabled={isSubmitting}
              placeholder="Select technologies..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Select technologies from the list
            </p>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Project Thumbnail
              </label>
              <div className="border-dashed border-2 p-4 text-center rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="thumbnail"
                  disabled={isSubmitting}
                />
                <label htmlFor="thumbnail" className="block cursor-pointer">
                  <CloudUpload className="mx-auto text-gray-500" size={32} />
                  <p className="text-sm text-gray-500 mt-2">
                    Drag or Browse Thumbnail
                  </p>
                </label>
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="mt-4 w-40 h-auto mx-auto rounded-lg shadow"
                  />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-gray-800 text-base"
                placeholder="Describe your project (max 300 characters)..."
                required
                disabled={isSubmitting}
              ></textarea>
              <div className="text-xs text-gray-500 text-right">{descLimit}/300</div>
            </div>
          </div>
          <div className="mt-6 w-full mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className={`ml-4 px-4 py-2 text-white text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 ${isSubmitting
                      ? "bg-green-900 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                    }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>

              {success && (
                <div className="w-full md:w-[50%] bg-green-100 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm md:text-base">
                  <Check size={20} />
                  <span className="flex-1">Project updated successfully!</span>
                </div>
              )}
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}
