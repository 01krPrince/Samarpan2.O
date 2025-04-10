import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  FaCheck,
  FaGithub,
  FaExternalLinkAlt,
  FaDownload,
  FaEye
} from 'react-icons/fa';

const ProjectDetails = () => {
  const location = useLocation();
  const project = location.state?.project;
  const [remarks, setRemarks] = useState([]);
  const token = localStorage.getItem('token');
  const [remark, setRemark] = useState();
  const [selectedRemark, setSelectedRemark] = useState('');
  const [comment, setComment] = useState('');
  const [isReviewed, setIsReviewed] = useState(project.markAsCheck || false);


  useEffect(() => {
    setSelectedRemark(project.remarks)
    setComment(project.comment)
    setRemark(project.remarks)
    fetch('https://samarpan2-o.onrender.com/api/remarks/all', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    })
      .then(res => res.json())
      .then(data => setRemarks(data))
      .catch(err => console.error('Error fetching remarks:', err));
  }, []);


  const handleMarkAsReviewed = () => {
    if (!selectedRemark || !comment) {
      alert("Please select a remark and enter a comment before submitting.");
      return;
    }

    fetch(`https://samarpan2-o.onrender.com/api/projects/reviewProject?remarks=${selectedRemark}&comment=${encodeURIComponent(comment)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({
        ...project,
        markAsCheck: true,
      })
    })
      .then(res => {
        if (res.ok) {
          console.log(res);
          alert("Project marked as reviewed successfully!");
          setIsReviewed(true);
        } else {
          throw new Error("Failed to update project.");
        }
      })
      .catch(err => {
        console.error("Error updating project:", err);
        alert("Something went wrong while submitting the review.");
      });
  };


  if (!project) {
    return <div className="text-center mt-10 text-gray-600">Project data not available.</div>;
  }

  return (
    <div className=" mt-20 xl:w-[800px] md:w-[600px] w-[300px] mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">{project.projectName}</h2>
          <div className="text-gray-500 flex items-center space-x-2 mt-2">
            <span className="text-blue-900 font-bold">👤 {project.studentName || "Unknown Student"}</span>
            <span>•</span>
            <span className="text-gray-600 text-sm font-medium">
              📅{" "}
              {new Date(project.submissionDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-gray-600 text-sm space-y-1 mb-6">
        <div>
          📍 <span className="font-medium">Branch:</span> {project.branch}   |
          🎓 <span className="font-medium">Batch:</span> {project.batch}
        </div>
        <div>
          📚 <span className="font-medium">Subject:</span> {project.subject}
        </div>
      </div>

      {project.imageUrls && (
        <div className="relative mt-6 mb-6 group overflow-hidden rounded-md border">
          <img
            src={project.imageUrls}
            alt="Project Preview"
            className="w-full h-72 object-cover transition-all duration-300 group-hover:h-auto"
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Project Description</h3>
          <p className="text-gray-600 max-h-44 overflow-y-scroll">{project.description}</p>
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Technologies Used</h3>
            <div className="flex space-x-2">
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
          <div className="flex items-center space-x-2 mt-2 text-blue-500">
            <a href={project.githubLink} className='flex' target='blank'><FaGithub /><span className="hover:underline ml-2">GitHub Repository</span></a>
          </div>
          <div className="flex items-center space-x-2 mt-2 text-blue-500">
            <a href={project.deployedLink} className='flex' target='blank'><FaExternalLinkAlt /> <span className="hover:underline ml-2">Live Demo</span></a>
          </div>
          <h3 className="font-semibold text-gray-700 mt-4 mb-2">Submission Files</h3>
          {['Project Documentation.pdf', 'Source Code.zip'].map((file, idx) => (
            <div key={idx} className="flex items-center space-x-2 mt-2 text-gray-700">
              <FaDownload /> <span className="hover:underline">{file}</span>
            </div>
          ))}
        </div>
      </div>

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

      <select
        className="w-full mt-2 px-4 py-2 border rounded-md text-sm"
        value={selectedRemark}
        onChange={(e) => setSelectedRemark(e.target.value)}
      >
        <option value="" disabled>Select Remark</option>
        {remarks.map((remark, index) => (
          <option key={index} value={remark}>
            {remark.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
          </option>
        ))}
      </select>

      <div className="flex items-center justify-between gap-4 mt-4">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <button
          onClick={handleMarkAsReviewed}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 shadow-sm
      ${project.markAsCheck
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-800 text-white hover:bg-gray-900'}`}
        >
          {project.markAsCheck ? 'Update Remarks' : 'Mark as Checked'}
        </button>
      </div>


      <div className='py-1 px-3 max-h-auto max-w-auto bg-gray-300 flex'></div>

      <div className="text-gray-500 text-sm mt-6 flex justify-between">
        <span>© 2025 ProjectReview. All rights reserved.</span>
        <div className="flex space-x-2">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Help Center</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
