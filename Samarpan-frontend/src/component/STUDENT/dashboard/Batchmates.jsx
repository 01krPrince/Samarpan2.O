import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Batchmates = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  const filteredProjects = projects.filter((project) =>
    project?.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const studentId = user?.id;
    const batchId = user?.batch?.id;

    if (!studentId || !batchId) {
      console.error('Student ID or Batch ID is missing');
      setError('User information is missing. Please log in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `https://samarpan2-o.onrender.com/api/projects/getProjectByBatchId?batchId=${batchId}&studentId=${studentId}&page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            navigate('/login');
          }
          throw new Error(`Failed to fetch projects. Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProjects(data.content || []);
        setTotalPages(data.totalPages || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error.message);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      });
  }, [navigate, page, size]);

  const renderSkeleton = () => {
    return Array.from({ length: size }).map((_, i) => (
      <div
        key={i}
        className="w-full bg-white rounded-2xl shadow-sm p-6 animate-pulse"
      >
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto"></div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col py-8 px-0 sm:px-6 lg:px-8 mt-10 pb-72">
       <h2 className="text-xl sm:text-2xl font-semibold mb-4 px-3">Batchmates&apos; Projects</h2>
      <div className="w-full max-w-7xl mx-auto mb-8 px-5">
    
        <div className="relative">
          <input
            type="text"
            placeholder="Search by student, batch & project name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search projects by student name"
          />
          <svg
            className="absolute right-3 top-3 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
      </div>

      <div className="w-full p-5 max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          renderSkeleton()
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={project.imageUrls || '/fallback-project-image.jpg'}
                  alt={project.projectName}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/fallback-project-image.jpg';
                  }}
                />
                <span
                  className={`absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full ${
                    project.markAsCheck
                      ? 'bg-indigo-500 text-white'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                  // " : "
                >
                  {project.markAsCheck ? 'Checked' : 'Unchecked'}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {project.projectName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {project.studentName} | {project.batch}
                </p>
                {project.deployedLink && (
                  <a
                    href={project.deployedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200"
                    aria-label={`View live demo of ${project.projectName}`}
                  >
                    Live Demo
                  </a>
                )}
                <p className="mt-4 text-xs text-gray-400 italic text-center">
                  Submitted:{' '}
                  {new Date(project.submissionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-12">
            No projects found matching your search.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
          aria-label="Previous Page"
        >
          Previous
        </button>
        <span className="text-sm mt-2 text-gray-700">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Batchmates;
