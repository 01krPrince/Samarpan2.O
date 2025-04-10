import { useState, useEffect } from "react";
import { CloudUpload, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UpdateProject() {
  const [formData, setFormData] = useState({
    studentName: "",
    projectName: "",
    deployedLink: "",
    githubLink: "",
    description: "",
    subject: "",
    thumbnail: null,
    technologiesUsed: [],
    projectId: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [descLimit, setDescLimit] = useState(0);
  const [technologiesUsedList, setTechnologiesUsedList] = useState("");
  const [loadUpdate, setLoadUpdate] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state?.project;

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
        technologiesUsed: project.technologiesUsed || [],
        projectId: project.projectId || "",
      });
      setTechnologiesUsedList(project.technologiesUsed?.join(", ") || "");
      setThumbnailPreview(project.imageUrls || null);
      setDescLimit(project.description?.length || 0);
    } else {
      setError("No project data available to update.");
    }

    fetch("https://samarpan2-o.onrender.com/api/subject/getAllSubjects")
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Error fetching subjects:", err));
  }, [project, navigate]);

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

    if (thumbnailPreview) {
      console.log("Old image exists. Can remove it from here.");
      // Email not responding to get confirmation to check the API Secret of Cloudnary......
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
    setLoadUpdate(true)
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    const batchId = userData?.batch?.id;

    if (!token) return navigate("/");
    if (!formData.subject) return setError("Please select a subject.");
    if (!technologiesUsedList.trim()) return setError("Enter at least one technology used.");
    if (!batchId) return setError("Batch information is missing.");
    if (!formData.projectId) return setError("Project ID is missing.");

    const techArray = technologiesUsedList
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);

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
        technologiesUsed: techArray,
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
          return navigate("/");
        } else {
          return setError("Failed to update project: " + (result.message || "Unknown error"));
        }
      }

      setSubmitted(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("Something went wrong: " + err.message);
    }
    setLoadUpdate(false)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-[10vh]">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-10 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800">[ <u>{formData.projectName}</u> ]</h2>
        <p className="text-gray-600 mb-6">Edit your existing project details below.</p>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-gray-700">
            {formData.studentName} | {userData?.batch?.batchName || "N/A"}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.subjectName}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deployed Link</label>
            <input
              type="url"
              name="deployedLink"
              value={formData.deployedLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub Link</label>
            <input
              type="url"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="https://github.com/"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Technologies Used</label>
            <input
              type="text"
              name="technologiesUsed"
              value={technologiesUsedList}
              onChange={(e) => setTechnologiesUsedList(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="e.g., React, Node.js, MongoDB"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project Thumbnail</label>
            <div className="border-dashed border-2 p-4 text-center rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="file" onChange={handleFileChange} className="hidden" id="thumbnail" />
              <label htmlFor="thumbnail" className="block">
                <CloudUpload className="mx-auto text-gray-500" size={32} />
                <p className="text-sm text-gray-500 mt-2">Replace Thumbnail (optional)</p>
              </label>
              {thumbnailPreview && (
                <div className="mt-4">
                  <p className="text-xs text-gray-600">Current Thumbnail:</p>
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-40 h-auto mx-auto rounded-lg shadow"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Describe your project (max 300 characters)..."
              required
            ></textarea>
            <div className="text-xs text-gray-500 text-right">{descLimit}/300</div>
          </div>

          <button
            type="submit"
            className={`px-4 py-1.5 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 ${loadUpdate
                ? "bg-gray-500 hover:bg-gray-500 focus:ring-gray-500"
                : "bg-gray-800 hover:bg-gray-900 focus:ring-gray-800"
              }`}
          >
            {loadUpdate ? "Saving..." : "Save Changes"}
          </button>


        </form>

        {submitted && (
          <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg flex items-center gap-2">
            <Check size={20} />
            <span>Project updated successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}
