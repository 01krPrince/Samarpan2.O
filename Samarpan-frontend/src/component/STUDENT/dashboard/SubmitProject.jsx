import { useState, useEffect } from "react";
import { CloudUpload, Check } from "lucide-react";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     try {
  //       setUserData(JSON.parse(storedUser));
  //     } catch (e) {
  //       console.error("Invalid JSON in localStorage 'user'", e);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/subject/getAllSubjects")
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, thumbnail: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 md:pt-[10vh] pt-[6vh]">
      <div className="rounded-lg p-6 md:p-10 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800">Submit Your Project</h2>
        <p className="text-gray-600 mb-6">Fill in the details below to submit your project for review.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 font-medium text-black">Student </label>
            <input
              type="text"
              name="studentName"
              value={userData?.name || "Student"}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
            />
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
            >
              <option value="">Select a Subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject.subjectName} >
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

          {/* <p className="text-sm text-gray-500">
            Submission timestamp: <strong>{currentTime}</strong>
          </p> */}


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
