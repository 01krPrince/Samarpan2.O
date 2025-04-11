import { useState, useEffect } from "react";
import { CloudUpload, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [technologiesUsedList, setTechnologiesUsedList] = useState("");

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
    if (!technologiesUsedList.trim()) {
      setError("Enter at least one technology used.");
      setIsSubmitting(false);
      return;
    }
    if (!batchId) {
      setError("Batch information is missing.");
      setIsSubmitting(false);
      return;
    }

    const techArray = technologiesUsedList
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);

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
        technologiesUsed: techArray,
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
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError("Something went wrong: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-[10vh] -ml-8">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-10 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800">Submit Your Project</h2>
        <p className="text-gray-600 mb-6">Fill in the details to submit your project for review.</p>

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
              disabled={isSubmitting} // Disable while submitting
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project Thumbnail</label>
            <div className="border-dashed border-2 p-4 text-center rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="thumbnail"
                disabled={isSubmitting}
              />
              <label htmlFor="thumbnail" className="block">
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
            <label className="block text-sm font-medium text-gray-700">Project Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Describe your project (max 300 characters)..."
              required
              disabled={isSubmitting}
            ></textarea>
            <div className="text-xs text-gray-500 text-right">{descLimit}/300</div>
          </div>

          <button
            type="submit"
            className={`px-4 py-1.5 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 cursor-pointer ${
              isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {submitted && !isSubmitting && (
          <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg flex items-center gap-2">
            <Check size={20} />
            <span>Project submitted successfully! Redirecting...</span>
          </div>
        )}
      </div>
    </div>
  );
}