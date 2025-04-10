import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredProjects = projects.filter(project =>
    project?.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const adminId = user?.id;
    console.log("Admin ID:", adminId);

    fetch(`https://samarpan2-o.onrender.com/api/projects/all?adminId=${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            console.warn("Unauthorized. Redirecting to login...");
            navigate("/login");
          }
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Data:", data);
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      });
  }, [navigate]);

  const renderSkeleton = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="w-[320px] sm:w-[280px] bg-white rounded-xl overflow-hidden shadow p-4 animate-pulse"
      >
        <div className="w-full h-40 bg-gray-300 mb-3 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto mt-4"></div>
      </div>
    ));
  };

  return (
    <div className="pt-0 w-full min-h-auto px-4 mt-14 xl:mt-20 md:mt-16 bg-gray-100">
      <div className="w-full max-w-full mx-auto py-2">
        <input
          type="text"
          placeholder="Search by student name"
          className="w-full px-2 py-1 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="p-4 h-auto flex flex-wrap gap-4">
        {loading ? (
          renderSkeleton()
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div
              key={index}
              className="w-[320px] sm:w-[280px] bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
            >
              <img
                src={project.imageUrls}
                alt={project.projectName}
                className="w-full h-40 object-cover rounded mb-2"
                onError={(e) => {
                  e.target.src = 'path/to/fallback-image.jpg';
                }}
              />

              <div className="p-4 relative">
                <div
                  className={`absolute top-4 right-4 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full ${project.markAsCheck ? 'bg-green-200' : 'bg-red-200'
                    }`}
                >
                  {project.markAsCheck ? "Checked" : "Unchecked"}
                </div>

                <h2 className="text-lg font-semibold text-black">{project.projectName}</h2>
                <p className="text-sm text-gray-600 mt-1">{project.studentName} | {project.batch}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2 px-3 rounded"
                    onClick={() => navigate('/admin/review-project', { state: { project } })}
                  >
                    View Details
                  </button>
                </div>
                <p className="mt-5 text-xs text-gray-500 italic flex justify-center">
                  Submitted: {new Date(project.submissionDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">No projects found</p>
        )}
      </div>
    </div>
  );
};

export default Landing;
