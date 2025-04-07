import { useState, useEffect } from "react";
import { CloudUpload, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubmitProject() {
  const [formData, setFormData] = useState({
    studentName: "John Doe",
    projectName: "",
    deployedLink: "",
    githubLink: "",
    description: "",
    subject: "",
    thumbnail: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [userData, setUserData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      console.log("User data from localStorage:", parsedUser);
    } else if (token) {
      setUserData({ token });
      console.log("Token found in localStorage:", token);
    } else {
      console.warn("No user data or token found in localStorage");
    }
    fetch("http://localhost:8080/api/subject/getAllSubjects")
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
        console.log("Subjects fetched:", data); // Debug subjects
      })
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, thumbnail: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.thumbnail) {
      setError("Please upload a thumbnail!");
      return;
    }

    if (!formData.subject) {
      setError("Please select a subject!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      navigate("/");
      return;
    }

    try {
      // Uploading to Cloudinary
      const data = new FormData();
      data.append("file", formData.thumbnail);
      data.append("upload_preset", "samarpan_unsigned");
      data.append("folder", "Samarpan-projects-preview");

      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dickevacs/image/upload", {
        method: "POST",
        body: data,
      });

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        console.error("Cloudinary error:", cloudinaryData);
        setError("Image upload failed: " + cloudinaryData.error?.message);
        return;
      }

      const thumbnailUrl = cloudinaryData.secure_url;

      // Find subject by name and get its ID
      const selectedSubject = subjects.find((sub) => sub.subjectName === formData.subject);
      if (!selectedSubject) {
        setError("Invalid subject selected!");
        return;
      }

      const completeProjectData = {
        projectName: formData.projectName || "",
        githubLink: formData.githubLink || "",
        deployedLink: formData.deployedLink || "",
        imageUrls: thumbnailUrl || "",
        batch: userData?.batch?.batchName?.toString() || "N/A",
        batchId: userData?.batch?.id?.toString() || "",
        subject: formData.subject || "",
        subjectId: selectedSubject.id.toString(), // Guaranteed to be a valid ID
      };

      console.log("Submitting project data:", completeProjectData);
      console.log("Authorization token:", token);

      const response = await fetch("http://localhost:8080/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(completeProjectData),
      });

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (!response.ok) {
        console.error("Server response:", result);
        if (response.status === 401) {
          setError("Unauthorized: Invalid or expired token. Please log in again.");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setError("Failed to submit project: " + (result.message || result || "Unknown error"));
        }
        return;
      }

      console.log("Project submitted:", result);
      setSubmitted(true);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Something went wrong while submitting the project: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 md:pt-[0vh] pt-[10vh]">
      <div className="rounded-lg p-6 md:p-10 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800">Submit Your Project</h2>
        <p className="text-gray-600 mb-6">Fill in the details below to submit your project for review.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="right text-sm text-gray-700">
            {userData?.name || "Guest"} | {userData?.batch?.batchName || "N/A"}
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-black">Project Name</label>
            <input
              type="text"
              name="projectName"
              placeholder="Enter project name"
              value={formData.projectName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-black">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required // Make subject selection mandatory
            >
              <option value="">Select a Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.subjectName}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-black">Deployed Project Link</label>
            <input
              type="url"
              name="deployedLink"
              placeholder="https://"
              value={formData.deployedLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-black">GitHub Link</label>
            <input
              type="url"
              name="githubLink"
              placeholder="https://github.com/"
              value={formData.githubLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-black">Project Thumbnail</label>
            <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-50 hover:cursor-pointer">
              <input type="file" onChange={handleFileChange} className="hidden" id="thumbnail" />
              <label htmlFor="thumbnail" className="block">
                <CloudUpload className="mx-auto text-gray-500" size={32} />
                <p className="text-sm text-gray-500 mt-2">Drag and drop your thumbnail here</p>
                <div className="text-xs text-gray-700 ">OR</div>
                <span className="text-blue-600 cursor-pointer">Browse Files</span>
              </label>
            </div>
            {formData.thumbnail && <p className="text-sm text-gray-700 mt-2">{formData.thumbnail.name}</p>}
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-black">Project Description</label>
            <textarea
              name="description"
              placeholder="Describe your project..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg h-24"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-lg transition hover:bg-gray-700"
          >
            🚀 Submit Project
          </button>
        </form>

        {submitted && (
          <div className="mt-4 flex items-center justify-between bg-green-100 text-green-700 p-3 rounded-lg">
            <Check size={20} />
            <span>Project submitted successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}