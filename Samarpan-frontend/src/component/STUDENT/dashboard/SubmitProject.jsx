import { useState, useEffect } from "react";
import { CloudUpload, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function SubmitProject() {
  const [formData, setFormData] = useState({
    studentName: "",
    projectName: "",
    deployedLink: "",
    githubLink: "",
    description: "",
    subject: "",
    thumbnail: null,
    technologiesUsed: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [descLimit, setDescLimit] = useState(0);
  const [technologiesUsedList, setTechnologiesUsedList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUserData(parsedUser);
    setFormData((prev) => ({
      ...prev,
      studentName: parsedUser.name || "John Doe",
    }));

    fetch("https://samarpan2-o.onrender.com/api/subject/getAllSubjects")
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Error fetching subjects:", err));
  }, [navigate]);

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

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type! Please upload an image (jpg, jpeg, png, gif, webp).");
      return;
    }

    setError(null);
    setFormData({ ...formData, thumbnail: file });
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const getSubjectIdByName = (subjectName) => {
    const subject = subjects.find((subj) => subj.subjectName === subjectName);
    return subject ? subject.id : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const batchId = userData?.batch?.id;

    if (!token) {
      setIsSubmitting(false);
      return navigate("/");
    }

    if (!formData.thumbnail) {
      setError("Please upload a thumbnail.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.subject) {
      setError("Please select a subject.");
      setIsSubmitting(false);
      return;
    }

    if (!technologiesUsedList.length) {
      setError("Enter at least one technology used.");
      setIsSubmitting(false);
      return;
    }

    if (!batchId) {
      setError("Batch information is missing.");
      setIsSubmitting(false);
      return;
    }

    try {
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
        setError("Image upload failed: " + cloudinaryData.error?.message);
        setIsSubmitting(false);
        return;
      }

      const thumbnailUrl = cloudinaryData.secure_url;
      const subjectId = getSubjectIdByName(formData.subject);

      const completeProjectData = {
        ...formData,
        technologiesUsed: technologiesUsedList,
        imageUrls: thumbnailUrl,
        batch: userData?.batch?.batchName || "N/A",
        batchId: batchId.toString(),
        subjectId,
        branch: userData?.batch?.branch || "N/A",
        branchId: userData?.batch?.branchId || "N/A",
      };

      const response = await fetch("https://samarpan2-o.onrender.com/api/projects/create", {
        method: "POST",
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
          setError("Failed to submit project: " + (result.message || "Unknown error"));
          setIsSubmitting(false);
          return;
        }
      }

      setSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Something went wrong: " + err.message);
      setIsSubmitting(false);
    }
  };

  const skillOptions = [
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "SASS", label: "SASS" },
    { value: "Tailwind CSS", label: "Tailwind CSS" },
    { value: "Bootstrap", label: "Bootstrap" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "React", label: "React" },
    { value: "Next.js", label: "Next.js" },
    { value: "Vue.js", label: "Vue.js" },
    { value: "Angular", label: "Angular" },
    { value: "Node.js", label: "Node.js" },
    { value: "Express", label: "Express" },
    { value: "Java", label: "Java" },
    { value: "Spring Boot", label: "Spring Boot" },
    { value: "Python", label: "Python" },
    { value: "Django", label: "Django" },
    { value: "Flask", label: "Flask" },
    { value: "PHP", label: "PHP" },
    { value: "Laravel", label: "Laravel" },
    { value: "Go", label: "Go" },
    { value: "Ruby on Rails", label: "Ruby on Rails" },
    { value: "Flutter", label: "Flutter" },
    { value: "Dart", label: "Dart" },
    { value: "React Native", label: "React Native" },
    { value: "Kotlin", label: "Kotlin" },
    { value: "Swift", label: "Swift" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "MySQL", label: "MySQL" },
    { value: "PostgreSQL", label: "PostgreSQL" },
    { value: "SQLite", label: "SQLite" },
    { value: "Redis", label: "Redis" },
    { value: "Firebase", label: "Firebase" },
    { value: "Docker", label: "Docker" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "AWS", label: "AWS" },
    { value: "Azure", label: "Azure" },
    { value: "GCP", label: "GCP" },
    { value: "Git", label: "Git" },
    { value: "GitHub Actions", label: "GitHub Actions" },
    { value: "CI/CD", label: "CI/CD" },
    { value: "Nginx", label: "Nginx" },
    { value: "Netlify", label: "Netlify" },
    { value: "Cloudinary", label: "Cloudinary" },
    { value: "Render", label: "Render" },
    { value: "GraphQL", label: "GraphQL" },
    { value: "REST API", label: "REST API" },
    { value: "Swagger", label: "Swagger" },
    { value: "gRPC", label: "gRPC" },
    { value: "WebSockets", label: "WebSockets" },
    { value: "Jest", label: "Jest" },
    { value: "Mocha", label: "Mocha" },
    { value: "Cypress", label: "Cypress" },
    { value: "Figma", label: "Figma" },
    { value: "Postman", label: "Postman" },
    { value: "VS Code", label: "VS Code" },
    { value: "Linux", label: "Linux" },
  ];

  return (
    <div className="pt-[10vh] items-center justify-center min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 pb-50">
      <h2 className="text-lg md:text-2xl font-semibold text-gray-800 px-3">Submit Your Project</h2>

      <div className="pt-5 px-4 sm:px-6 md:px-10 w-full max-w-6xl mx-auto">
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">

          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">Project Name</label>
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
              <label className="block text-sm md:text-base font-medium text-gray-700">Subject</label>
              <Select
                options={subjects.map((subject) => ({
                  value: subject.subjectName,
                  label: subject.subjectName,
                }))}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, subject: selected?.value || "" }))
                }
                isDisabled={isSubmitting}
                placeholder="Select subject"
                className="text-sm"
              />
            </div>
          </div>

          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">Deployed Link</label>
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
              <label className="block text-sm md:text-base font-medium text-gray-700">GitHub Link</label>
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
            <label className="block text-sm md:text-base font-medium text-gray-700">Technologies Used</label>
            <Select
              isMulti
              name="technologiesUsed"
              options={skillOptions}
              className="text-sm"
              classNamePrefix="react-select"
              value={skillOptions.filter((opt) => technologiesUsedList.includes(opt.value))}
              onChange={(selected) => {
                const selectedValues = selected ? selected.map((s) => s.value) : [];
                setTechnologiesUsedList(selectedValues);
              }}
              isDisabled={isSubmitting}
              placeholder="Select technologies..."
            />
            <p className="text-xs text-gray-500 mt-1">Select technologies from the list</p>
          </div>

          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">Project Thumbnail</label>
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
                  <p className="text-sm text-gray-500 mt-2">Drag or Browse Thumbnail</p>
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
              <label className="block text-sm md:text-base font-medium text-gray-700">Project Description</label>
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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 w-full mb-10">
            <button
              type="submit"
              className={`w-full md:w-auto px-4 py-2 cursor-pointer justify-end text-white text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 ${isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900"
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            {submitted && !isSubmitting && (
              <div className="w-full md:w-[50%] bg-green-100 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm md:text-base">
                <Check size={20} />
                <span className="flex-1">Project submitted successfully! Redirecting...</span>
              </div>
            )}
          </div>
        </form>


      </div>
    </div>

  );
}
