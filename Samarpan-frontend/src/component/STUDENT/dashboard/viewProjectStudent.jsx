import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaGithub,
  FaExternalLinkAlt,
  FaDownload,
  FaUserCircle,
  FaEdit,
} from "react-icons/fa";

const fallbackImage = "https://via.placeholder.com/600x400?text=No+Image+Available";

const ViewProjectStudent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const project =
    location.state?.project || {
      projectName: "Demo Project",
      studentName: "Demo User",
      submissionDate: new Date().toISOString(),
      markAsCheck: false,
      branch: "CSE",
      batch: "2025",
      subject: "ReactJS",
      imageUrls: "",
      description: "This is a demo project for update functionality.",
      technologiesUsed: ["React", "Node.js"],
      githubLink: "https://github.com/",
      deployedLink: "https://demo.com",
      files: [],
      remarks: ["Great job!"],
      mentorName: "Mentor Demo",
      comment: "Keep it up!",
    };

  const getTechnologies = (tech) =>
    Array.isArray(tech)
      ? tech
      : typeof tech === "string"
      ? tech.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  return (
    <div className="pt-[10vh] items-center justify-center min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100pb-50 px-2">
      <main className="w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg pb-14">
        <h2 className="text-lg md:text-2xl font-semibold text-gray-800 px-3 mb-6">
          Project Details
        </h2>
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.projectName}</h2>
            <div className="text-gray-500 flex flex-wrap items-center gap-3 mt-2 text-sm">
              <span className="text-blue-900 font-bold flex items-center">
                <FaUserCircle className="mr-1" />
                {project.studentName || "Unknown Student"}
              </span>
              <span>•</span>
              <span>
                📅{" "}
                {project.submissionDate
                  ? new Date(project.submissionDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No Date"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-4 py-1.5 text-sm font-semibold rounded-md flex items-center gap-1 ${
                project.markAsCheck
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-400 text-white"
              }`}
            >
              {project.markAsCheck && <FaCheck />}{" "}
              {project.markAsCheck ? "Checked" : "Unchecked"}
            </span>
            <button
              onClick={() => navigate("/update-project", { state: { project } })}
              className="px-4 py-1.5 bg-gray-800 cursor-pointer text-white text-sm rounded-md hover:bg-gray-900 flex items-center gap-2"
            >
              <FaEdit /> Edit
            </button>
          </div>
        </section>
        <section className="text-gray-600 text-sm mb-6 space-y-1">
          <div>
            📍 <span className="font-medium">Branch:</span> {project.branch || "N/A"} &nbsp;|&nbsp;
            🎓 <span className="font-medium">Batch:</span> {project.batch || "N/A"}
          </div>
          <div>
            📚 <span className="font-medium">Subject:</span> {project.subject || "N/A"}
          </div>
        </section>
        <section className="rounded-lg overflow-hidden border mb-8 flex flex-col items-center">
          <img
            src={project.imageUrls || fallbackImage}
            alt="Project Preview"
            className="w-full h-64 object-cover hover:h-2/12 cursor-pointer transition-transform rounded-lg"
            onError={(e) => (e.target.src = fallbackImage)}
          />
        </section>
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Project Description</h3>
            <p className="text-justify text-gray-600">
              {project.description || "No description provided."}
            </p>
            <h3 className="font-semibold text-gray-700 mt-6 mb-3">Technologies Used</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {getTechnologies(project.technologiesUsed).length ? (
                getTechnologies(project.technologiesUsed).map((tech, idx) => (
                  <span key={idx} className="bg-gray-200 px-2 py-1 text-sm rounded-md">
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No technologies listed.</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Project Links</h3>
            {project.githubLink ? (
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  <FaGithub className="mr-2" /> GitHub Repository
                </a>
              </div>
            ) : (
              <p className="text-gray-400 mb-2">No GitHub link provided.</p>
            )}

            {project.deployedLink ? (
              <div className="flex items-center gap-2 text-blue-500">
                <a
                  href={project.deployedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  <FaExternalLinkAlt className="mr-2" /> Live Demo
                </a>
              </div>
            ) : (
              <p className="text-gray-400">No live demo provided.</p>
            )}

            <h3 className="font-semibold text-gray-700 mt-5 mb-3">Submission Files</h3>
            {project.files?.length ? (
              project.files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700 mb-2">
                  <FaDownload />
                  <a href={file.url} download className="hover:underline">
                    {file.name}
                  </a>
                </div>
              ))
            ) : (
              ["Project Documentation.pdf", "Source Code.zip"].map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-400 mb-2">
                  <FaDownload /> {file} (Not uploaded)
                </div>
              ))
            )}
          </div>
        </section>
        {project.remarks?.[0] && (
          <section className="bg-gray-50 border rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reviewed By</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold ring-2 ring-indigo-200">
                {(project.mentorName && project.mentorName[0]) || "P"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {project.mentorName || "Project Mentor"}
                </p>
                <div className="mt-3 bg-white border rounded p-3 space-y-2">
                  <p>
                    <span className="font-medium text-gray-800">Remarks:</span>{" "}
                    {project.remarks?.[0] || "No remarks"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Comment:</span>{" "}
                    {project.comment || "No comments"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ViewProjectStudent;
