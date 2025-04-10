import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaCheck,
  FaGithub,
  FaExternalLinkAlt,
  FaDownload,
} from 'react-icons/fa';

const ViewDetails = () => {
  const location = useLocation();
  const project = location.state?.project;
  const navigate = useNavigate();

  if (!project) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Project data not available.
      </div>
    );
  }

  return (
    <div className="mt-20 max-w-[95%] sm:max-w-[90%] md:max-w-[600px] xl:max-w-[800px] mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">{project.projectName}</h2>
          <div className="text-gray-500 flex flex-wrap items-center space-x-2 mt-2 text-sm">
            <span className="text-blue-900 font-bold">👤 {project.studentName || "Unknown Student"}</span>
            <span>•</span>
            <span>
              📅{" "}
              {new Date(project.submissionDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`px-4 py-1.5 text-sm font-semibold rounded-md shadow-sm transition-colors duration-200 ${project.markAsCheck
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-red-500 text-white hover:bg-red-600'
              }`}
          >
            {project.markAsCheck ? 'Checked' : 'UnChecked'}
          </button>

          <button
            onClick={() => navigate(`/update-project`, { state: { project } })}
            className="px-4 py-1.5 bg-gray-800 text-white text-sm font-semibold rounded-md hover:bg-gray-900 shadow-sm"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="text-gray-600 text-sm space-y-1 mb-6">
        <div>
          📍 <span className="font-medium">Branch:</span> {project.branch} &nbsp;|&nbsp;
          🎓 <span className="font-medium">Batch:</span> {project.batch}
        </div>
        <div>
          📚 <span className="font-medium">Subject:</span> {project.subject}
        </div>
      </div>

      {/* Image */}
      {project.imageUrls && (
        <div className="relative mt-6 mb-6 group overflow-hidden rounded-md border">
          <img
            src={project.imageUrls}
            alt="Project Preview"
            className="w-full h-64 object-cover sm:h-72 transition-all duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Description and Links */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Project Description</h3>
          <p className="text-gray-600 text-justify">{project.description}</p>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {(project.technologiesUsed || []).map((tech, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 text-sm rounded-md text-gray-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Project Links</h3>
          {project.githubLink && (
            <div className="flex items-center space-x-2 mt-2 text-blue-500">
              <a href={project.githubLink} className="flex items-center" target="_blank" rel="noopener noreferrer">
                <FaGithub /> <span className="hover:underline ml-2">GitHub Repository</span>
              </a>
            </div>
          )}
          {project.deployedLink && (
            <div className="flex items-center space-x-2 mt-2 text-blue-500">
              <a href={project.deployedLink} className="flex items-center" target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt /> <span className="hover:underline ml-2">Live Demo</span>
              </a>
            </div>
          )}

          <h3 className="font-semibold text-gray-700 mt-4 mb-2">Submission Files</h3>
          {['Project Documentation.pdf', 'Source Code.zip'].map((file, idx) => (
            <div key={idx} className="flex items-center space-x-2 mt-2 text-gray-700">
              <FaDownload /> <span className="hover:underline">{file}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review */}
      {project.review && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Review History</h3>
          <div className="flex items-start space-x-3">
            <span className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></span>
            <div>
              <p className="font-semibold text-gray-900">
                {project.review.reviewerName}{' '}
                <span className="text-gray-500">{project.review.reviewerRole}</span>
              </p>
              <p className="text-gray-600 mt-1">{project.review.comment}</p>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(project.review.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-gray-500 text-sm mt-6 flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
        <span>© 2025 ProjectReview. All rights reserved.</span>
        <div className="flex space-x-4">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Help Center</span>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
