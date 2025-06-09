import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from './Footer';

const Landing = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const filteredProjects = projects.filter(project =>
    project?.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const adminId = user?.id;

    setLoading(true);
    fetch(`https://samarpan2-o.onrender.com/api/projects/all?adminId=${adminId}&page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/login");
          }
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProjects(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      });
  }, [navigate, page, size]);

  const renderSkeleton = () => {
    return Array.from({ length: size }).map((_, i) => (
      <div
        key={i}
        className="w-full bg-white rounded-xl overflow-hidden shadow p-4 animate-pulse"
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
    <div className="mt-16 min-h-screen bg-gray-100 flex flex-col items-center py-4 px-2 sm:px-4 lg:px-8 w-full">
      <div className="w-full max-w-6xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Search by student name"
          className="w-full px-3 py-2 border rounded shadow-sm text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center px-2">
        {loading ? (
          renderSkeleton()
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative">
                <img
                  src={project.imageUrls}
                  alt={project.projectName}
                  className="w-full h-40 object-cover rounded-t hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'path/to/fallback-image.jpg';
                  }}
                />
                <div
                  className={`absolute top-2 right-2 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full ${
                    project.markAsCheck ? 'bg-green-200' : 'bg-red-200'
                  }`}
                >
                  {project.markAsCheck ? "Checked" : "Unchecked"}
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-base sm:text-lg font-semibold text-black">{project.projectName}</h2>
                <p className="text-sm text-gray-600 mt-1">{project.studentName} | {project.batch}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2 px-3 rounded cursor-pointer"
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
          <p className="text-center text-gray-500 col-span-full">No projects found</p>
        )}
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <span className="text-sm mt-2">Page {page + 1} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;
