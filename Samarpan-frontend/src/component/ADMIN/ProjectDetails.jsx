import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from "react-router-dom";
import { FaCheck, FaGithub, FaExternalLinkAlt, FaDownload } from "react-icons/fa";

const ProjectDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReviewed, setIsReviewed] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Invalid Project ID");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/projects/getProjectById?projectId=${id}`)

      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch project details");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched project details:", data);
        setDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (loading) return <p className="text-gray-500">Loading project details...</p>;

  if (!details) return <p className="text-gray-500">No project details available</p>;

  //   useEffect(() => {
  //     const savedReviewStatus = localStorage.getItem(`reviewed-${id}`);
  //     if (savedReviewStatus === "true") {
  //       setIsReviewed(true);
  //     }},[id])

  //     const handleMarkAsReviewed = useCallback(() => {
  //         setIsReviewed(true);
  //         localStorage.setItem(`reviewed-${id}`, "true");
  //       }, [id]);


  return (
    <div className="xl:w-[800px] md:w-[600px] md:mt-12 xl:mt-10 w-[300px] mt-4 h-screen mx-auto p-6  ">
      <h2 className="text-2xl font-extrabold mt-2 ">{details.projectName}</h2>
      <div className="text-gray-500 flex items-center space-x-2 mt-4">
        <span className='text-blue-900 font-bold'>👤 {details.student.name}</span>
        <span>•</span>
        <span className='text-gray-900'>{new Date(details.submissionDate).toLocaleDateString()}</span>
        {/* <div>
            {isReviewed ? (
              <button className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                <FaCheck /> <span>Reviewed</span>
              </button>
            ) : (
              <button
                onClick={handleMarkAsReviewed}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Mark as Reviewed
              </button>
            )}
          </div> */}
      </div>
      <p className="mt-6 text-gray-900  ">
        A comprehensive e-commerce dashboard with analytics, inventory
        management, and order processing capabilities.
      </p>
      <div className="mt-6">
        <h3 className="font-semibold">Technologies Used</h3>
        <div className="flex space-x-2 mt-3 overflow-x-auto xl:overflow-x-hidden 2xl:overflow-hidden">
          {['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS'].map((tech) => (
            <span key={tech} className="bg-gray-400 px-2 py-1 text-sm rounded-md">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 xl:grid xl:grid-cols-2 gap-7 ">
        <div>

          <div className="flex items-center space-x-2  mt-2 text-blue-500">
            <FaGithub /> <a
              href={details.githubLink.startsWith("http") ? details.githubLink : `https://${details.githubLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {details.githubLink}
            </a>
          </div>

          <div className="flex items-center space-x-2 mt-2 text-blue-500">
            <FaExternalLinkAlt />
            <button
              onClick={() => window.open(details.deployedLink.startsWith("http") ? details.deployedLink : `https://${details.deployedLink}`, "_blank")}
              className="hover:underline"
            >
              {details.deployedLink}
            </button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mt-1">Submission Files</h3>
          <div className="flex items-center space-x-2 mt-4 text-gray-700">
            <FaDownload /> <a href="#" className="hover:underline">Project Documentation.pdf</a>
          </div>
          <div className="flex items-center space-x-2 mt-2 text-gray-700">
            <FaDownload /> <a href="#" className="hover:underline">Source Code.zip</a>
          </div>
        </div>
      </div>
      <div className="xl:mt-14 bg-gray-100 p-4 rounded-lg ">
        <h3 className="font-semibold">Review History</h3>
        <div className="mt-8 flex space-x-3 flex-col xl:flex-none">
          <span className="bg-gray-300 w-10 h-10 rounded-full"></span>
          <div>
            <p className="font-semibold">Sarah Johnson <span className="text-gray-500">Project Mentor</span></p>
            <p className="text-gray-700 mt-1">
              Great implementation of the dashboard features. The code structure is clean and well-documented.
            </p>
          </div>
          <span className="text-gray-500">March 10, 2025</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails
